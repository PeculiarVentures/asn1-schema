import { AsnNode, ParseContext, MaterializeOptions, MaterializeFilter } from "./types";
import { SchemaBinder } from "./core/bind";

// String constants for better maintainability
const INCLUDE = "include" as const;
const EXCLUDE = "exclude" as const;
const RAW_DATA_KEY = "_raw" as const;
const VALUE_RAW_DATA_KEY = "_valueRaw" as const;
const SEQUENCE_OF_TYPE = "SEQUENCE OF" as const;
const CHOICE_TYPE = "CHOICE" as const;
const DECODED_DATA_KEY = "decoded" as const;

// Materialize cache for default configuration
const MAT_CACHE_DEFAULT = new WeakMap<AsnNode, unknown>();

// Materialize cache for filtered results
const MAT_CACHE_FILTERED = new WeakMap<AsnNode, Map<string, unknown>>();

/**
 * Create a cache key for filter options
 */
function createFilterCacheKey(filter: MaterializeFilter | undefined): string | null {
  if (!filter) return null;

  // Create a deterministic key from filter configuration
  const parts: string[] = [];

  // Add default policy
  parts.push(`default:${filter.default || INCLUDE}`);

  // Add byPath policies (sorted for consistency)
  if (filter.byPath) {
    const pathKeys = Object.keys(filter.byPath).sort();
    if (pathKeys.length > 0) {
      const pathPairs = pathKeys.map((key) => `${key}=${filter.byPath![key]}`);
      parts.push(`byPath:{${pathPairs.join(",")}}`);
    }
  }

  // Add byField policies (sorted for consistency)
  if (filter.byField) {
    const fieldKeys = Object.keys(filter.byField).sort();
    if (fieldKeys.length > 0) {
      const fieldPairs = fieldKeys.map((key) => `${key}=${filter.byField![key]}`);
      parts.push(`byField:{${fieldPairs.join(",")}}`);
    }
  }

  // Add byType policies (sorted for consistency)
  if (filter.byType) {
    const typeKeys = Object.keys(filter.byType).sort();
    if (typeKeys.length > 0) {
      const typePairs = typeKeys.map((key) => `${key}=${filter.byType![key]}`);
      parts.push(`byType:{${typePairs.join(",")}}`);
    }
  }

  // Add other options
  if (filter.includeRaw) parts.push("includeRaw:true");
  if (filter.maxDepth !== undefined) parts.push(`maxDepth:${filter.maxDepth}`);

  return parts.join("|");
}

/**
 * Check if a filter only includes things (no exclusions), making it compatible with full results
 */
function isInclusiveOnlyFilter(filter: MaterializeFilter): boolean {
  // If default is FILTER_POLICY_EXCLUDE, we need to check that all explicit policies are FILTER_POLICY_INCLUDE
  if (filter.default === EXCLUDE) {
    // Check all byPath policies
    if (filter.byPath) {
      for (const policy of Object.values(filter.byPath)) {
        if (policy !== INCLUDE) return false;
      }
    }
    // Check all byField policies
    if (filter.byField) {
      for (const policy of Object.values(filter.byField)) {
        if (policy !== INCLUDE) return false;
      }
    }
    // Check all byType policies
    if (filter.byType) {
      for (const policy of Object.values(filter.byType)) {
        if (policy !== INCLUDE) return false;
      }
    }
    return true;
  }

  // If default is FILTER_POLICY_INCLUDE, check that there are no explicit exclusions
  if (filter.default === INCLUDE) {
    // Check all byPath policies
    if (filter.byPath) {
      for (const policy of Object.values(filter.byPath)) {
        if (policy === EXCLUDE) return false;
      }
    }
    // Check all byField policies
    if (filter.byField) {
      for (const policy of Object.values(filter.byField)) {
        if (policy === EXCLUDE) return false;
      }
    }
    // Check all byType policies
    if (filter.byType) {
      for (const policy of Object.values(filter.byType)) {
        if (policy === EXCLUDE) return false;
      }
    }
    return true;
  }

  return false;
}

/**
 * Check if a filter only uses simple field rules (no paths or types)
 */
function isSimpleFieldFilter(filter: MaterializeFilter): boolean {
  // Only byField rules are allowed, no byPath or byType
  return !filter.byPath && !filter.byType && !!filter.byField;
}

/**
 * Apply filter to an already materialized result
 */
function applyFilterToResult(
  result: unknown,
  filter: MaterializeFilter,
  currentPath = "",
): unknown {
  if (!result || typeof result !== "object") {
    return result;
  }

  // For arrays and typed arrays, handle them as primitive values
  if (Array.isArray(result) || result instanceof Uint8Array) {
    return result;
  }

  // For objects, filter properties based on filter rules
  const filtered: Record<string, unknown> = {};

  for (const [key, value] of Object.entries(result)) {
    const fieldPath = currentPath ? `${currentPath}.${key}` : key;
    let include = filter.default === INCLUDE;

    // Check byPath rules first (most specific)
    if (filter.byPath?.[fieldPath] !== undefined) {
      include = filter.byPath[fieldPath] === INCLUDE;
    }
    // Check byField rules
    else if (filter.byField?.[key] !== undefined) {
      include = filter.byField[key] === INCLUDE;
    }
    // Check byType rules (least specific)
    // Note: We can't easily determine type from materialized result,
    // so this is a simplification

    if (include) {
      filtered[key] =
        typeof value === "object" && value !== null && !(value instanceof Uint8Array)
          ? applyFilterToResult(value, filter, fieldPath)
          : value;
    }
  }

  return filtered;
}

// Trie structure for compiled path filters
interface TrieNode {
  children: Map<string, TrieNode>;
  terminal?: boolean;
  policy?: "include" | "exclude";
}

// Stack frame for iterative materialization
interface MaterializeFrame {
  node: AsnNode;
  state: number; // 0 = start, 1 = processing children, 2 = done
  outParent: any;
  outKey: string | number | null;
  pathParts: string[];
  depth: number;
  childIndex?: number;
  tempResult?: any;
}

/**
 * Utility functions for working with ASN.1 nodes
 */

export class AsnTreeUtils {
  /**
   * Compile path filter into trie structure for fast lookup without string concatenation
   */
  private static compilePathFilter(filter: MaterializeFilter | undefined): TrieNode | null {
    if (!filter?.byPath) return null;

    const root: TrieNode = {
      children: new Map(),
    };

    for (const [path, policy] of Object.entries(filter.byPath)) {
      let current = root;
      const segments = path.split(".");

      for (const segment of segments) {
        if (!current.children.has(segment)) {
          current.children.set(segment, {
            children: new Map(),
          });
        }
        current = current.children.get(segment)!;
      }

      // Mark terminal and store policy
      current.terminal = true;
      current.policy = policy;
    }

    return root;
  }

  /**
   * Check if path matches compiled trie filter
   */
  private static shouldIncludeByCompiledPath(
    pathTrie: TrieNode | null,
    pathParts: string[],
    filter: MaterializeFilter | undefined,
  ): boolean {
    if (!pathTrie || !filter) return true;

    // Check if any parent path or current path is explicitly included
    let current = pathTrie;
    let foundExplicitInclude = false;

    for (let i = 0; i < pathParts.length; i++) {
      const part = pathParts[i];
      if (!current.children.has(part)) {
        break;
      }
      current = current.children.get(part)!;

      // Check if this level has an explicit include policy
      if (current.terminal && current.policy === INCLUDE) {
        foundExplicitInclude = true;
      }
    }

    // If we found an explicit include at any level, include this node
    if (foundExplicitInclude) {
      return true;
    }

    // Check if current path is explicitly included
    current = pathTrie;
    for (const part of pathParts) {
      if (!current.children.has(part)) {
        // Path not found in trie, use default policy
        return filter.default === INCLUDE;
      }
      current = current.children.get(part)!;
    }

    // If this is a terminal node, use its policy, otherwise use default
    if (current.terminal) {
      return current.policy === INCLUDE;
    }

    // Also check if any deeper path would be included (parent path inclusion)
    if (filter.default === EXCLUDE && filter.byPath) {
      const currentPath = pathParts.join(".");
      for (const includePath of Object.keys(filter.byPath)) {
        if (filter.byPath[includePath] === INCLUDE) {
          // Check if current path is a parent of the included path
          // Empty path (root) is parent of all paths
          if (
            currentPath === "" ||
            includePath.startsWith(currentPath + ".") ||
            includePath === currentPath
          ) {
            return true; // Include parent of explicitly included path
          }
        }
      }
    }

    return filter.default === INCLUDE;
  }
  /**
   * Find a node by field name (true breadth-first search)
   */
  static findByFieldName(root: AsnNode, fieldName: string): AsnNode | null {
    const queue = [root];

    for (let i = 0; i < queue.length; i++) {
      const node = queue[i];
      if (node.fieldName === fieldName) {
        return node;
      }
      if (node.children) {
        queue.push(...node.children);
      }
    }

    return null;
  }

  /**
   * Find a node by path (e.g., "tbsCertificate.subject")
   */
  static findByPath(root: AsnNode, path: string): AsnNode | null {
    if (!path || path === "") {
      return root;
    }

    const parts = path.split(".");
    let current = root;
    const partsLen = parts.length;

    for (let i = 0; i < partsLen; i++) {
      const part = parts[i];
      if (!current.children) {
        return null;
      }

      // Use simple for loop for better V8 performance
      const children = current.children;
      const childrenLen = children.length;
      let found: AsnNode | null = null;

      for (let j = 0; j < childrenLen; j++) {
        if (children[j].fieldName === part) {
          found = children[j];
          break;
        }
      }

      if (!found) {
        return null;
      }

      current = found;
    }

    return current;
  }

  /**
   * Get all nodes with a specific type name
   */
  static findByTypeName(root: AsnNode, typeName: string): AsnNode[] {
    const results: AsnNode[] = [];
    const stack = [root];

    for (let i = 0; i < stack.length; i++) {
      const node = stack[i];
      if (node.typeName === typeName) {
        results.push(node);
      }

      if (node.children) {
        // Push children in reverse order to maintain DFS order
        const children = node.children;
        for (let j = children.length - 1; j >= 0; j--) {
          stack.push(children[j]);
        }
      }
    }

    return results;
  }

  /**
   * Get a summary of the ASN.1 structure (optimized for linear performance)
   */
  static summarize(node: AsnNode, depth: number = 0, out: string[] = []): string {
    const indent = "  ".repeat(depth);
    const name = node.fieldName || `[${node.tagClass}.${node.type}]`;
    const type = node.typeName || (node.constructed ? "CONSTRUCTED" : "PRIMITIVE");

    out.push(`${indent}${name}: ${type}`);

    if (node.children) {
      out.push(` (${node.children.length} children)\n`);
      const len = node.children.length;
      for (let i = 0; i < len; i++) {
        this.summarize(node.children[i], depth + 1, out);
      }
    } else {
      out.push("\n");
    }

    // Return joined result only at root level
    return depth === 0 ? out.join("") : "";
  }

  /**
   * Materialize an ASN.1 tree into a JavaScript object (supports schema in two-phase)
   */
  static materialize(node: AsnNode, ctx: ParseContext, options?: MaterializeOptions): unknown {
    const filter = options?.filter;
    const onlyDecoded = options?.onlyDecoded ?? true;
    const includeRaw = !!filter?.includeRaw;

    // Cache only for default configuration (no filter, onlyDecoded=true, no raw)
    const cacheableDefault = onlyDecoded && !filter && !includeRaw;
    if (cacheableDefault) {
      const cached = MAT_CACHE_DEFAULT.get(node);
      if (cached !== undefined) {
        return cached;
      }
    }

    // Check cache for filtered results
    const filterCacheKey = createFilterCacheKey(filter);
    const cacheableFiltered = onlyDecoded && !includeRaw && filterCacheKey;
    if (cacheableFiltered) {
      const nodeCache = MAT_CACHE_FILTERED.get(node);
      if (nodeCache) {
        const cached = nodeCache.get(filterCacheKey);
        if (cached !== undefined) {
          return cached;
        }
      }

      // Check if we can use full result for this filter (only for simple field-only filters)
      if (filter && isInclusiveOnlyFilter(filter) && isSimpleFieldFilter(filter)) {
        const fullResult = MAT_CACHE_DEFAULT.get(node);
        if (fullResult !== undefined) {
          // Filter the full result and cache it
          const filteredResult = applyFilterToResult(fullResult, filter, "");
          if (!nodeCache) {
            MAT_CACHE_FILTERED.set(node, new Map());
          }
          MAT_CACHE_FILTERED.get(node)!.set(filterCacheKey, filteredResult);
          return filteredResult;
        }
      }
    }

    // Smart trie compilation - only for filters with multiple complex paths
    const pathTrie =
      filter?.byPath &&
      Object.keys(filter.byPath).length > 2 &&
      Object.keys(filter.byPath).some((path) => path.includes("."))
        ? this.compilePathFilter(filter)
        : null;

    // Use optimized approach with improved trie structure
    // Use iterative approach only for simple cases without complex schemas
    const result = pathTrie
      ? this.materializeWithFilterOptimized(node, ctx, filter, onlyDecoded, [], 0, pathTrie)
      : this.materializeWithFilter(node, ctx, filter, onlyDecoded, "", 0);

    // Cache results
    if (cacheableDefault) {
      MAT_CACHE_DEFAULT.set(node, result);
    } else if (cacheableFiltered) {
      let nodeCache = MAT_CACHE_FILTERED.get(node);
      if (!nodeCache) {
        nodeCache = new Map();
        MAT_CACHE_FILTERED.set(node, nodeCache);
      }
      nodeCache.set(filterCacheKey, result);
    }

    return result;
  }

  /**
   * Iterative materialize implementation for better performance
   */
  private static materializeIterative(
    rootNode: AsnNode,
    ctx: ParseContext,
    filter: MaterializeFilter | undefined,
    onlyDecoded: boolean,
    pathTrie: TrieNode | null,
  ): unknown {
    const stack: MaterializeFrame[] = [
      {
        node: rootNode,
        state: 0,
        outParent: null,
        outKey: null,
        pathParts: [],
        depth: 0,
      },
    ];

    let rootResult: unknown = undefined;

    while (stack.length > 0) {
      const frame = stack.pop()!;
      const { node, state, pathParts, depth } = frame;

      // Check depth limit
      if (filter?.maxDepth !== undefined && depth > filter.maxDepth) {
        const result = onlyDecoded ? undefined : node.valueRaw || node.raw;
        this.setIterativeResult(frame, result);
        if (frame.outParent === null) rootResult = result;
        continue;
      }

      // Check filter policy using compiled trie or fallback to original method
      const shouldInclude = pathTrie
        ? this.shouldIncludeByCompiledPath(pathTrie, pathParts, filter)
        : this.shouldIncludeNodeOld(node, filter, pathParts.join("."));

      if (!shouldInclude) {
        const result = onlyDecoded ? undefined : node.valueRaw || node.raw;
        this.setIterativeResult(frame, result);
        if (frame.outParent === null) rootResult = result;
        continue;
      }

      if (state === 0) {
        // Initial processing

        // If we have a decoded value, return it
        if (node.decoded !== null) {
          let result: unknown = node.decoded;

          // Special handling for CHOICE - return as object
          if (node.typeName === CHOICE_TYPE && node.fieldName) {
            result = { [node.fieldName]: node.decoded };
          }

          // Include raw data if requested for leaf nodes
          if (filter?.includeRaw && !node.constructed) {
            if (!node.raw) node.raw = ctx.sliceRaw(node);
            if (!node.valueRaw) node.valueRaw = ctx.sliceValueRaw(node);
            result = {
              [DECODED_DATA_KEY]: result,
              [RAW_DATA_KEY]: node.raw,
              [VALUE_RAW_DATA_KEY]: node.valueRaw,
            };
          }

          this.setIterativeResult(frame, result);
          if (frame.outParent === null) rootResult = result;
          continue;
        }

        // Try to decode based on schema (if bound)
        if (node.schemaId >= 0 && ctx.schema) {
          const schemaNode = ctx.schema.nodes.get(node.schemaId);
          if (schemaNode?.decoder) {
            const decoded = ctx.decode(node);
            const result =
              schemaNode.isChoice && node.fieldName ? { [node.fieldName]: decoded } : decoded;
            this.setIterativeResult(frame, result);
            if (frame.outParent === null) rootResult = result;
            continue;
          }

          // Special handling for CHOICE
          if (schemaNode?.isChoice && schemaNode.children) {
            for (const choice of schemaNode.children) {
              if (SchemaBinder.matchesSchema(node, choice) && choice.decoder) {
                const originalDecoder = schemaNode.decoder;
                (schemaNode as any).decoder = choice.decoder;
                const decoded = ctx.decode(node);
                (schemaNode as any).decoder = originalDecoder;
                const result = { [choice.name]: decoded };
                this.setIterativeResult(frame, result);
                if (frame.outParent === null) rootResult = result;
                break;
              }
            }
            continue;
          }
        }

        // For constructed types, materialize children
        if (node.constructed && node.children) {
          const isSeqOf =
            node.isSequenceOf !== undefined
              ? node.isSequenceOf
              : !!(node.typeName && node.typeName.includes(SEQUENCE_OF_TYPE));

          if (isSeqOf) {
            // SEQUENCE OF - prepare array
            const children = node.children;
            const len = children.length;
            frame.tempResult = new Array<unknown>(len);
            frame.childIndex = 0;
            frame.state = 1; // Move to child processing state
            stack.push(frame); // Re-push current frame

            // Process children in reverse order (stack)
            for (let i = len - 1; i >= 0; i--) {
              // For SEQUENCE OF items, we don't add the [i] to the path for filter checking
              // since if the SEQUENCE OF is included, all items should be included
              stack.push({
                node: children[i],
                state: 0,
                outParent: frame.tempResult,
                outKey: i,
                pathParts: [...pathParts], // Use parent path, not item path
                depth: depth + 1,
              });
            }
            continue;
          }

          if (node.fieldName) {
            // Named object
            frame.tempResult = {};
            frame.childIndex = 0;
            frame.state = 1;
            stack.push(frame);

            const children = node.children;
            for (let i = children.length - 1; i >= 0; i--) {
              const child = children[i];
              if (child.fieldName) {
                const childPathParts = [...pathParts, child.fieldName];
                stack.push({
                  node: child,
                  state: 0,
                  outParent: frame.tempResult,
                  outKey: child.fieldName,
                  pathParts: childPathParts,
                  depth: depth + 1,
                });
              }
            }
            continue;
          } else {
            // Array
            frame.tempResult = [];
            frame.childIndex = 0;
            frame.state = 1;
            stack.push(frame);

            const children = node.children;
            for (let i = children.length - 1; i >= 0; i--) {
              const childPathParts = [...pathParts, `[${i}]`];
              stack.push({
                node: children[i],
                state: 0,
                outParent: frame.tempResult,
                outKey: i,
                pathParts: childPathParts,
                depth: depth + 1,
              });
            }
            continue;
          }
        }

        // Return raw data if not decoded and requested
        if (!onlyDecoded) {
          if (!node.raw) node.raw = ctx.sliceRaw(node);
          if (!node.valueRaw) node.valueRaw = ctx.sliceValueRaw(node);
          const result = node.valueRaw || node.raw;
          this.setIterativeResult(frame, result);
          if (frame.outParent === null) rootResult = result;
          continue;
        }

        // Special handling for ANY type - return raw ASN.1 bytes
        if (node.typeName === "ANY" || (!node.decoded && !node.constructed && node.schemaId < 0)) {
          if (!node.raw) node.raw = ctx.sliceRaw(node);
          const result = node.raw;
          this.setIterativeResult(frame, result);
          if (frame.outParent === null) rootResult = result;
          continue;
        }

        this.setIterativeResult(frame, undefined);
        if (frame.outParent === null) rootResult = undefined;
      } else if (state === 1) {
        // Finalize constructed object/array
        let result = frame.tempResult;

        if (Array.isArray(result)) {
          // Compact array by removing undefined elements
          let j = 0;
          for (let i = 0; i < result.length; i++) {
            if (result[i] !== undefined) {
              result[j++] = result[i];
            }
          }
          result.length = j;
        }

        // Include raw data if requested for constructed nodes
        if (
          filter?.includeRaw &&
          typeof result === "object" &&
          result !== null &&
          !Array.isArray(result)
        ) {
          if (!node.raw) node.raw = ctx.sliceRaw(node);
          if (!node.valueRaw) node.valueRaw = ctx.sliceValueRaw(node);
          (result as any)[RAW_DATA_KEY] = node.raw;
          (result as any)[VALUE_RAW_DATA_KEY] = node.valueRaw;
        }

        // Special handling for CHOICE
        if (node.typeName === CHOICE_TYPE && node.fieldName) {
          result = { [node.fieldName]: result };
        }

        this.setIterativeResult(frame, result);
        if (frame.outParent === null) rootResult = result;
      }
    }

    return rootResult;
  }

  /**
   * Helper to set result in iterative materialize
   */
  private static setIterativeResult(frame: MaterializeFrame, result: unknown): void {
    if (frame.outParent === null) {
      // This is the root - result will be set by caller
      return;
    }

    if (result === undefined) return;

    if (Array.isArray(frame.outParent)) {
      frame.outParent[frame.outKey as number] = result;
    } else if (typeof frame.outParent === "object" && frame.outParent !== null) {
      const key = frame.outKey as string;
      const existing = frame.outParent[key];
      if (existing !== undefined) {
        if (Array.isArray(existing)) {
          existing.push(result);
        } else {
          frame.outParent[key] = [existing, result];
        }
      } else {
        frame.outParent[key] = result;
      }
    }
  }

  /**
   * Legacy shouldIncludeNode for fallback when not using compiled path filter
   */
  private static shouldIncludeNodeOld(
    node: AsnNode,
    filter: MaterializeFilter | undefined,
    currentPath: string,
  ): boolean {
    if (!filter) return true;

    const fromPath = filter.byPath?.[currentPath];
    const fromField = filter.byField?.[node.fieldName || ""];
    const fromType = filter.byType?.[node.typeName || ""];

    const policy = fromPath ?? fromField ?? fromType;

    if (policy !== undefined) {
      return policy === INCLUDE;
    }

    // If no explicit policy found and default is FILTER_POLICY_EXCLUDE, check if this is parent of included field
    if (filter.default === EXCLUDE) {
      // Check byPath first
      if (filter.byPath) {
        for (const includePath of Object.keys(filter.byPath)) {
          if (filter.byPath[includePath] === INCLUDE) {
            // Check if current path is a parent of the included path
            // Empty path (root) is parent of all paths
            if (
              currentPath === "" ||
              includePath.startsWith(currentPath + ".") ||
              includePath === currentPath
            ) {
              return true; // Include parent of explicitly included path
            }
          }
        }
      }

      // Check byField - if any field is included, include root (empty path)
      if (filter.byField && currentPath === "") {
        for (const fieldName of Object.keys(filter.byField)) {
          if (filter.byField[fieldName] === INCLUDE) {
            return true; // Include root if any field is explicitly included
          }
        }
      }
    }

    return filter.default === INCLUDE;
  }

  /**
   * Optimized materialize with compiled path filter
   */
  private static materializeWithFilterOptimized(
    node: AsnNode,
    ctx: ParseContext,
    filter: MaterializeFilter | undefined,
    onlyDecoded: boolean,
    pathParts: string[],
    depth: number,
    pathTrie: TrieNode | null,
  ): unknown {
    // Check depth limit
    if (filter?.maxDepth !== undefined && depth > filter.maxDepth) {
      return onlyDecoded ? undefined : node.valueRaw || node.raw;
    }

    // Check filter policy using compiled trie (no string concatenation)
    const shouldInclude = pathTrie
      ? this.shouldIncludeByCompiledPathFast(pathTrie, pathParts, filter)
      : this.shouldIncludeNodeOld(node, filter, pathParts.join("."));

    if (!shouldInclude) {
      return onlyDecoded ? undefined : node.valueRaw || node.raw;
    }

    // If we have a decoded value, return it
    if (node.decoded !== null) {
      let result: unknown = node.decoded;

      // Special handling for CHOICE - return as object
      if (node.typeName === CHOICE_TYPE && node.fieldName) {
        result = { [node.fieldName]: node.decoded };
      }

      // Include raw data if requested for leaf nodes
      if (filter?.includeRaw && !node.constructed) {
        // Create raw data on demand if not captured
        if (!node.raw) {
          node.raw = ctx.sliceRaw(node);
        }
        if (!node.valueRaw) {
          node.valueRaw = ctx.sliceValueRaw(node);
        }
        result = {
          [DECODED_DATA_KEY]: result,
          [RAW_DATA_KEY]: node.raw,
          [VALUE_RAW_DATA_KEY]: node.valueRaw,
        };
      }

      return result;
    }

    // Try to decode based on schema (if bound)
    if (node.schemaId >= 0 && ctx.schema) {
      const schemaNode = ctx.schema.nodes.get(node.schemaId);
      if (schemaNode?.decoder) {
        const decoded = ctx.decode(node);
        // Special handling for CHOICE - return as object
        if (schemaNode.isChoice && node.fieldName) {
          return { [node.fieldName]: decoded };
        }
        return decoded;
      }
      // Special handling for CHOICE - try to find decoder from children
      if (schemaNode?.isChoice && schemaNode.children) {
        for (const choice of schemaNode.children) {
          if (SchemaBinder.matchesSchema(node, choice)) {
            if (choice.decoder) {
              // Temporarily set decoder on schemaNode for decoding
              const originalDecoder = schemaNode.decoder;
              (schemaNode as any).decoder = choice.decoder;
              const decoded = ctx.decode(node);
              (schemaNode as any).decoder = originalDecoder;
              return { [choice.name]: decoded };
            }
          }
        }
      }
    }

    // For constructed types, materialize children
    if (node.constructed && node.children) {
      // Special handling for SEQUENCE OF - return array of items (optimized)
      const isSeqOf =
        node.isSequenceOf !== undefined
          ? node.isSequenceOf
          : !!(node.typeName && node.typeName.includes(SEQUENCE_OF_TYPE));

      if (isSeqOf) {
        const children = node.children;
        const len = children.length;
        const arr = new Array<unknown>(len); // Pre-allocate array
        let j = 0;

        for (let i = 0; i < len; i++) {
          // For SEQUENCE OF, we don't need to check filter for individual items
          // If the SEQUENCE OF node itself is included, all items should be included
          const value = this.materializeWithFilterOptimized(
            children[i],
            ctx,
            undefined, // No filter for individual items
            onlyDecoded,
            pathParts,
            depth + 1,
            null, // No trie for individual items
          );

          if (value !== undefined) {
            arr[j++] = value;
          }
        }

        arr.length = j; // Remove holes in array
        return arr;
      }

      if (node.fieldName) {
        // Named object - group children by fieldName
        const obj: Record<string, unknown> = {};
        const children = node.children;
        const childrenLen = children.length;

        for (let i = 0; i < childrenLen; i++) {
          const child = children[i];
          if (child.fieldName) {
            // Reuse pathParts array for better performance
            pathParts.push(child.fieldName);
            const value = this.materializeWithFilterOptimized(
              child,
              ctx,
              filter,
              onlyDecoded,
              pathParts,
              depth + 1,
              pathTrie,
            );
            pathParts.pop(); // Remove the added segment

            if (value !== undefined) {
              // If field already exists, convert to array or append to existing array
              const existing = obj[child.fieldName];
              if (existing !== undefined) {
                if (Array.isArray(existing)) {
                  existing.push(value);
                } else {
                  obj[child.fieldName] = [existing, value];
                }
              } else {
                obj[child.fieldName] = value;
              }
            }
          }
        }

        // Include raw data if requested
        if (filter?.includeRaw) {
          // Create raw data on demand if not captured
          if (!node.raw) {
            node.raw = ctx.sliceRaw(node);
          }
          if (!node.valueRaw) {
            node.valueRaw = ctx.sliceValueRaw(node);
          }
          obj._raw = node.raw;
          obj._valueRaw = node.valueRaw;
        }

        // Special handling for CHOICE - wrap in choice name
        if (node.typeName === CHOICE_TYPE && node.fieldName) {
          return { [node.fieldName]: obj };
        }
        return obj;
      } else {
        // Array
        const arr: unknown[] = [];
        const children = node.children;
        const childrenLen = children.length;

        for (let i = 0; i < childrenLen; i++) {
          // Reuse pathParts array for better performance
          pathParts.push(`[${i}]`);
          const value = this.materializeWithFilterOptimized(
            node.children[i],
            ctx,
            filter,
            onlyDecoded,
            pathParts,
            depth + 1,
            pathTrie,
          );
          pathParts.pop(); // Remove the added segment

          if (value !== undefined) {
            arr.push(value);
          }
        }
        return arr;
      }
    }

    // Return raw data if not decoded and requested
    if (!onlyDecoded) {
      // Create raw data on demand if not captured
      if (!node.raw) {
        node.raw = ctx.sliceRaw(node);
      }
      if (!node.valueRaw) {
        node.valueRaw = ctx.sliceValueRaw(node);
      }
      return node.valueRaw || node.raw;
    }

    // Special handling for ANY type - return raw ASN.1 bytes
    if (node.typeName === "ANY" || (!node.decoded && !node.constructed && node.schemaId < 0)) {
      if (!node.raw) {
        node.raw = ctx.sliceRaw(node);
      }
      return node.raw;
    }

    return undefined;
  }

  /**
   * Fast trie-based path checking with reused array
   */
  private static shouldIncludeByCompiledPathFast(
    pathTrie: TrieNode,
    pathParts: string[],
    filter: MaterializeFilter | undefined,
  ): boolean {
    if (!filter) return true;

    let current = pathTrie;
    const len = pathParts.length;

    for (let i = 0; i < len; i++) {
      const part = pathParts[i];
      if (!current.children.has(part)) {
        // Path not found in trie, check if this is parent of included path
        if (filter.default === EXCLUDE && filter.byPath) {
          const currentPath = pathParts.slice(0, i + 1).join(".");
          for (const includePath of Object.keys(filter.byPath)) {
            if (filter.byPath[includePath] === INCLUDE) {
              // Check if current path is a parent of the included path
              // Empty path (root) is parent of all paths
              if (
                currentPath === "" ||
                includePath.startsWith(currentPath + ".") ||
                includePath === currentPath
              ) {
                return true; // Include parent of explicitly included path
              }
            }
          }
        }
        return filter.default === INCLUDE;
      }
      current = current.children.get(part)!;
    }

    // If this is a terminal node, use its policy, otherwise use default
    if (current.terminal) {
      return current.policy === INCLUDE;
    }

    // Check if this is parent of included path
    if (filter.default === EXCLUDE && filter.byPath) {
      const currentPath = pathParts.join(".");
      for (const includePath of Object.keys(filter.byPath)) {
        if (filter.byPath[includePath] === INCLUDE) {
          // Check if current path is a parent of the included path
          // Empty path (root) is parent of all paths
          if (
            currentPath === "" ||
            includePath.startsWith(currentPath + ".") ||
            includePath === currentPath
          ) {
            return true; // Include parent of explicitly included path
          }
        }
      }
    }

    return filter.default === INCLUDE;
  }

  /**
   * Internal materialize with filtering
   */
  private static materializeWithFilter(
    node: AsnNode,
    ctx: ParseContext,
    filter: MaterializeFilter | undefined,
    onlyDecoded: boolean,
    currentPath: string,
    depth: number,
  ): unknown {
    // Check depth limit
    if (filter?.maxDepth !== undefined && depth > filter.maxDepth) {
      return onlyDecoded ? undefined : node.valueRaw || node.raw;
    }

    // Check filter policy
    const shouldInclude = this.shouldIncludeNode(node, filter, currentPath);
    if (!shouldInclude) {
      return onlyDecoded ? undefined : node.valueRaw || node.raw;
    }

    // Check if this node was included directly (not as a parent)
    const isDirectlyIncluded =
      filter &&
      (filter.byPath?.[currentPath] === INCLUDE ||
        filter.byField?.[node.fieldName || ""] === INCLUDE ||
        filter.byType?.[node.typeName || ""] === INCLUDE);

    // If we have a decoded value, return it
    if (node.decoded !== null) {
      let result: unknown = node.decoded;

      // Special handling for CHOICE - return as object
      if (node.typeName === CHOICE_TYPE && node.fieldName) {
        result = { [node.fieldName]: node.decoded };
      }

      // Include raw data if requested for leaf nodes
      if (filter?.includeRaw && !node.constructed) {
        // Create raw data on demand if not captured
        if (!node.raw) {
          node.raw = ctx.sliceRaw(node);
        }
        if (!node.valueRaw) {
          node.valueRaw = ctx.sliceValueRaw(node);
        }
        result = {
          decoded: result,
          _raw: node.raw,
          _valueRaw: node.valueRaw,
        };
      }

      return result;
    }

    // Try to decode based on schema (if bound)
    if (node.schemaId >= 0 && ctx.schema) {
      const schemaNode = ctx.schema.nodes.get(node.schemaId);
      if (schemaNode?.decoder) {
        const decoded = ctx.decode(node);
        // Special handling for CHOICE - return as object
        if (schemaNode.isChoice && node.fieldName) {
          return { [node.fieldName]: decoded };
        }
        return decoded;
      }
      // Special handling for CHOICE - try to find decoder from children
      if (schemaNode?.isChoice && schemaNode.children) {
        for (const choice of schemaNode.children) {
          if (SchemaBinder.matchesSchema(node, choice)) {
            if (choice.decoder) {
              // Temporarily set decoder on schemaNode for decoding
              const originalDecoder = schemaNode.decoder;
              (schemaNode as any).decoder = choice.decoder;
              const decoded = ctx.decode(node);
              (schemaNode as any).decoder = originalDecoder;
              return { [choice.name]: decoded };
            }
          }
        }
      }
    }

    // For constructed types, materialize children
    if (node.constructed && node.children) {
      // Special handling for SEQUENCE OF - return array of items (optimized)
      const isSeqOf =
        node.isSequenceOf !== undefined
          ? node.isSequenceOf
          : !!(node.typeName && node.typeName.includes(SEQUENCE_OF_TYPE));

      if (isSeqOf) {
        const children = node.children;
        const len = children.length;
        const arr = new Array<unknown>(len); // Pre-allocate array
        let j = 0;

        for (let i = 0; i < len; i++) {
          // For SEQUENCE OF, we don't need to check filter for individual items
          // If the SEQUENCE OF node itself is included, all items should be included
          const value = this.materializeWithFilter(
            children[i],
            ctx,
            undefined, // No filter for individual items
            onlyDecoded,
            "", // Empty path for items
            depth + 1,
          );
          if (value !== undefined) {
            arr[j++] = value;
          }
        }

        arr.length = j; // Remove holes in array
        return arr;
      }

      if (node.fieldName) {
        // Named object - group children by fieldName
        const obj: Record<string, unknown> = {};
        const children = node.children;
        const childrenLen = children.length;

        for (let i = 0; i < childrenLen; i++) {
          const child = children[i];
          if (child.fieldName) {
            const childPath = currentPath ? `${currentPath}.${child.fieldName}` : child.fieldName;

            // If parent was directly included, create more permissive filter for children
            const childFilter =
              isDirectlyIncluded && filter
                ? {
                    ...filter,
                    default: INCLUDE,
                  }
                : filter;

            const value = this.materializeWithFilter(
              child,
              ctx,
              childFilter,
              onlyDecoded,
              childPath,
              depth + 1,
            );
            if (value !== undefined) {
              // If field already exists, convert to array or append to existing array
              const existing = obj[child.fieldName];
              if (existing !== undefined) {
                if (Array.isArray(existing)) {
                  existing.push(value);
                } else {
                  obj[child.fieldName] = [existing, value];
                }
              } else {
                obj[child.fieldName] = value;
              }
            }
          }
        }

        // Include raw data if requested
        if (filter?.includeRaw) {
          // Create raw data on demand if not captured
          if (!node.raw) {
            node.raw = ctx.sliceRaw(node);
          }
          if (!node.valueRaw) {
            node.valueRaw = ctx.sliceValueRaw(node);
          }
          obj._raw = node.raw;
          obj._valueRaw = node.valueRaw;
        }

        // Special handling for CHOICE - wrap in choice name
        if (node.typeName === CHOICE_TYPE && node.fieldName) {
          return { [node.fieldName]: obj };
        }
        return obj;
      } else {
        // Array
        const arr: unknown[] = [];
        const children = node.children;
        const childrenLen = children.length;

        for (let i = 0; i < childrenLen; i++) {
          const childPath = currentPath ? `${currentPath}[${i}]` : `[${i}]`;
          const value = this.materializeWithFilter(
            node.children[i],
            ctx,
            filter,
            onlyDecoded,
            childPath,
            depth + 1,
          );
          if (value !== undefined) {
            arr.push(value);
          }
        }
        return arr;
      }
    }

    // Return raw data if not decoded and requested
    if (!onlyDecoded) {
      // Create raw data on demand if not captured
      if (!node.raw) {
        node.raw = ctx.sliceRaw(node);
      }
      if (!node.valueRaw) {
        node.valueRaw = ctx.sliceValueRaw(node);
      }
      return node.valueRaw || node.raw;
    }

    // Special handling for ANY type - return raw ASN.1 bytes
    if (node.typeName === "ANY" || (!node.decoded && !node.constructed && node.schemaId < 0)) {
      if (!node.raw) {
        node.raw = ctx.sliceRaw(node);
      }
      return node.raw;
    }

    return undefined;
  }

  /**
   * Check if node should be included based on filter
   */
  private static shouldIncludeNode(
    node: AsnNode,
    filter: MaterializeFilter | undefined,
    currentPath: string,
  ): boolean {
    if (!filter) return true;

    // Check specific overrides in priority order
    const fromPath = filter.byPath?.[currentPath];
    const fromField = filter.byField?.[node.fieldName || ""];
    const fromType = filter.byType?.[node.typeName || ""];

    // Use first match, fallback to default
    const policy = fromPath ?? fromField ?? fromType;

    if (policy !== undefined) {
      return policy === INCLUDE;
    }

    // If no explicit policy found and default is FILTER_POLICY_EXCLUDE, check if this is parent of included field
    if (filter.default === EXCLUDE) {
      // Check byPath first
      if (filter.byPath) {
        for (const includePath of Object.keys(filter.byPath)) {
          if (filter.byPath[includePath] === INCLUDE) {
            // Check if current path is a parent of the included path
            // Empty path (root) is parent of all paths
            if (
              currentPath === "" ||
              includePath.startsWith(currentPath + ".") ||
              includePath === currentPath
            ) {
              return true; // Include parent of explicitly included path
            }
          }
        }
      }

      // Check byField - if any field is included, include root (empty path)
      if (filter.byField && currentPath === "") {
        for (const fieldName of Object.keys(filter.byField)) {
          if (filter.byField[fieldName] === INCLUDE) {
            return true; // Include root if any field is explicitly included
          }
        }
      }
    }

    return filter.default === INCLUDE;
  }
}

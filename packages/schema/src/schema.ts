import {
  builder,
  CompiledSchema,
  CompiledSchemaNode,
  SchemaBuilder,
  ParseContext,
  AsnNode,
  AsnDecoders,
} from "@peculiar/asn1-codec";
import { AsnRepeatType } from "./decorators";
import { AsnPropTypes, AsnTypeTypes } from "./enums";
import { IAsnConverter, IEmptyConstructor } from "./types";
import { isConvertible } from "./helper";
import { AsnArray } from "./objects";
import { defaultConverter } from "./converters";

export interface IAsnSchemaItem {
  type: AsnPropTypes | IEmptyConstructor;
  optional?: boolean;
  defaultValue?: unknown;
  context?: number;
  implicit?: boolean;
  converter?: IAsnConverter;
  /** True if converter provided explicitly by user via decorator */
  hasExplicitConverter?: boolean;
  repeated?: AsnRepeatType;
  raw?: boolean;
  /** If true, field decoding is deferred and performed lazily via getter */
  lazy?: boolean;
  /** If true, store original ASN.1 node into `<field>Node` property */
  node?: boolean;
}

export interface IAsnSchema {
  type: AsnTypeTypes;
  itemType: AsnPropTypes | IEmptyConstructor;
  items: { [key: string]: IAsnSchemaItem };
  schema?: AsnSchemaType;
}

export type AsnSchemaType = CompiledSchema;

export class AsnSchemaStorage {
  protected items = new WeakMap<object, IAsnSchema>();

  public has(target: object): boolean {
    return this.items.has(target);
  }

  public get(
    target: IEmptyConstructor,
    checkSchema: true,
  ): IAsnSchema & Required<Pick<IAsnSchema, "schema">>;
  public get(target: IEmptyConstructor, checkSchema?: false): IAsnSchema;
  public get(target: IEmptyConstructor, checkSchema = false): IAsnSchema {
    const schema = this.items.get(target);
    if (!schema) {
      throw new Error(`Cannot get schema for '${target.prototype.constructor.name}' target`);
    }
    if (checkSchema && !schema.schema) {
      throw new Error(
        `Schema '${target.prototype.constructor.name}' doesn't contain ASN.1 schema. Call 'AsnSchemaStorage.cache'.`,
      );
    }
    return schema;
  }

  public cache(target: IEmptyConstructor): void {
    const schema = this.get(target);
    if (!schema.schema) {
      schema.schema = this.create(target, true);
    }
  }

  public createDefault(target: object): IAsnSchema {
    // Initialize default ASN1 schema
    const schema = { type: AsnTypeTypes.Sequence, items: {} } as IAsnSchema;

    // Get and assign schema from parent
    const parentSchema = this.findParentSchema(target);
    if (parentSchema) {
      Object.assign(schema, parentSchema);
      schema.items = Object.assign({}, schema.items, parentSchema.items);
    }

    return schema;
  }

  public create(target: object, useNames: boolean): AsnSchemaType {
    const schema = this.items.get(target) || this.createDefault(target);

    const children: CompiledSchemaNode[] = [];

    for (const key in schema.items) {
      const item = schema.items[key];
      const name = useNames ? key : "";

      let childNode: CompiledSchemaNode;

      if (typeof item.type === "number") {
        // type is AsnPropType Enum - primitive ASN.1 type
        childNode = this.createPrimitiveNode(builder, item, name);
      } else if (isConvertible(item.type)) {
        // Convertible type - use its provided schema and decode via fromASN
        const instance = new (item.type as unknown as IEmptyConstructor)();
        // @ts-expect-error - convertible types provide toSchema(name)
        const convSchema = instance.toSchema?.(name);
        if (!convSchema || !convSchema.root?.expectedTag) {
          throw new Error("Convertible type doesn't provide schema");
        }
        const optional = !!item.optional || item.defaultValue !== undefined;

        const convDecoder = (ctx: ParseContext, node: AsnNode) => {
          const inst = new (item.type as unknown as IEmptyConstructor)() as unknown as {
            fromASN: (v: { node: AsnNode; context: ParseContext }) => unknown;
          };
          return inst.fromASN({ node, context: ctx });
        };

        childNode = builder.createNode({
          name,
          typeName: convSchema.root.typeName,
          expectedTag: convSchema.root.expectedTag,
          optional,
          default: item.defaultValue,
          decoder: convDecoder,
          children: convSchema.root.children,
          isChoice: convSchema.root.isChoice,
        });
      } else {
        // type is class with schema - complex type
        childNode = this.createComplexNode(builder, item, name);
      }

      // Handle repeated items (SEQUENCE OF / SET OF)
      if (item.repeated) {
        childNode = this.createRepeatedNode(builder, childNode, item, name);
      }

      // Handle context-specific tagging
      if (item.context !== null && item.context !== undefined) {
        childNode = this.createContextSpecificNode(builder, childNode, item, name);
      }

      children.push(childNode);
    }

    // Create root node based on schema type
    const rootNode = this.createRootNode(builder, schema, children, target as IEmptyConstructor);
    const builtSchema = builder.build(rootNode);

    return builtSchema;
  }

  private createPrimitiveNode(
    builder: SchemaBuilder,
    item: IAsnSchemaItem,
    name: string,
  ): CompiledSchemaNode {
    const typeInfo = this.getAsnTypeInfo(item.type as AsnPropTypes);
    const optional = !!item.optional || item.defaultValue !== undefined;
    // Always use converter for primitives (default or explicit) to preserve legacy JS shapes
    // like INTEGER -> number/string, BIT STRING -> ArrayBuffer, etc.
    const decoder = (ctx: ParseContext, node: AsnNode) => {
      if (!item.converter) {
        // Fallback to default converter if somehow not set (e.g., synthetic itemType)
        const conv = defaultConverter(item.type as AsnPropTypes);
        if (!conv) {
          const prim = this.getDecoderForPrimitiveType(item.type as AsnPropTypes);
          return prim(ctx, node);
        }
        return conv.fromASN({ node, context: ctx });
      }
      return item.converter.fromASN({ node, context: ctx });
    };

    return builder.createNode({
      name,
      typeName: typeInfo.typeName,
      expectedTag: typeInfo.expectedTag,
      optional,
      default: item.defaultValue,
      decoder,
    });
  }

  private createComplexNode(
    builder: SchemaBuilder,
    item: IAsnSchemaItem,
    name: string,
  ): CompiledSchemaNode {
    const optional = !!item.optional || item.defaultValue !== undefined;

    // For complex types, we need to distinguish convertible primitives and class-based schemas
    const ClassType = item.type as IEmptyConstructor;
    const instanceForSchema = new (ClassType as unknown as IEmptyConstructor)() as unknown;

    // If type implements IAsnConvertible (has fromASN/toASN), use its own schema and fromASN
    if (isConvertible(ClassType)) {
      // @ts-expect-error - convertible types provide toSchema(name)
      const convSchema: CompiledSchema | undefined = instanceForSchema.toSchema?.(name);
      if (!convSchema || !convSchema.root) {
        throw new Error("Convertible type doesn't provide schema");
      }
      const convDecoder = (ctx: ParseContext, node: AsnNode) => {
        const inst = new (ClassType as unknown as IEmptyConstructor)() as unknown as {
          fromASN: (v: { node: AsnNode; context: ParseContext }) => unknown;
        };
        return inst.fromASN({ node, context: ctx });
      };
      return builder.createNode({
        name,
        typeName: convSchema.root.typeName,
        expectedTag: convSchema.root.expectedTag,
        optional,
        default: item.defaultValue,
        decoder: convDecoder,
        children: convSchema.root.children,
        isChoice: convSchema.root.isChoice,
      });
    }

    // Otherwise it is a class with nested schema (SEQUENCE/SET/CHOICE)
    const nestedSchema = this.create(item.type as IEmptyConstructor, true); // Keep names for nested schemas

    // Special handling for CHOICE-typed classes used as properties
    if (nestedSchema.root.isChoice) {
      const choiceDecoder = (ctx: ParseContext, node: AsnNode) => {
        const inst = new ClassType() as Record<string, unknown>;
        const children = nestedSchema.root.children || [];
        // Determine tag of incoming node
        const tagKey = (node.tagClass << 16) | (node.type << 8) | (node.constructed ? 1 : 0);
        // Find matching choice arm
        let matched: CompiledSchemaNode | undefined;
        for (const ch of children) {
          if (!ch.expectedTag) continue;
          const k =
            (ch.expectedTag.cls << 16) |
            (ch.expectedTag.tag << 8) |
            (ch.expectedTag.constructed ? 1 : 0);
          if (k === tagKey) {
            matched = ch;
            break;
          }
        }
        if (!matched) {
          // Fallback: try first arm when no expectedTag (like ANY)
          matched = children.find((c) => !c.expectedTag);
        }
        if (!matched) {
          return inst;
        }
        // Decode current node using the matched arm's decoder directly
        if (!matched.decoder) {
          throw new Error("No decoder for matched CHOICE arm");
        }
        const value = matched.decoder(ctx, node);
        inst[matched.name] = value as unknown;
        return inst;
      };
      return builder.createNode({
        name,
        typeName: nestedSchema.root.typeName,
        optional,
        default: item.defaultValue,
        isChoice: true,
        children: nestedSchema.root.children,
        decoder: choiceDecoder,
      });
    }

    // Regular complex SEQUENCE/SET class
    const complexDecoder = (ctx: ParseContext, node: AsnNode) => {
      const created = new ClassType();
      // If target class extends AsnArray, fill it from element children
      if (created instanceof AsnArray) {
        const out = created as AsnArray<unknown>;
        for (const ch of node.children || []) {
          out.push(ctx.decode(ch));
        }
        return out;
      }
      const inst = created as Record<string, unknown>;
      const children = node.children || [];
      // Prepare lazy value cache per-instance
      const lazyCache = new WeakMap<object, Map<string, unknown>>();
      const getCacheFor = (o: object) => {
        let map = lazyCache.get(o);
        if (!map) {
          map = new Map<string, unknown>();
          lazyCache.set(o, map);
        }
        return map;
      };
      for (const child of children) {
        const field = child.fieldName || "";
        if (!field) continue;
        // Read field schema to check raw/lazy flags
        const parentSchema = this.items.get(ClassType as unknown as object);
        const fieldSchema = parentSchema?.items?.[field];

        if (fieldSchema?.lazy) {
          // Capture raw bytes for the child and set up lazy getter
          const raw = ctx.sliceRaw(child);
          const rawView = raw.buffer.slice(raw.byteOffset, raw.byteOffset + raw.byteLength);
          const decodeChild = () => ctx.decode(child);
          const cache = getCacheFor(inst);
          Object.defineProperty(inst, field, {
            configurable: true,
            enumerable: true,
            get() {
              if (cache.has(field)) return cache.get(field);
              // Decode on first access; to avoid relying on 'child' object after parse,
              // parse from rawView again using parseDER + bind to field schema node if possible.
              // Fall back to generic decodeChild when available.
              const v = decodeChild();
              cache.set(field, v as unknown);
              return v as unknown;
            },
            set(v: unknown) {
              cache.set(field, v);
            },
          });
          // Also expose Raw bytes if requested
          if (fieldSchema?.raw) {
            (inst as Record<string, unknown>)[`${field}Raw`] = rawView;
          }
          // Expose original node if requested
          if (fieldSchema?.node) {
            (inst as Record<string, unknown>)[`${field}Node`] = child;
          }
        } else {
          const value = ctx.decode(child);
          inst[field] = value as unknown;
          // capture raw bytes if field is marked with raw: true in schema
          const parentSchema = this.items.get(ClassType as unknown as object);
          const fieldSchema = parentSchema?.items?.[field];
          if (fieldSchema?.raw) {
            const raw = ctx.sliceRaw(child);
            const ab = raw.buffer.slice(raw.byteOffset, raw.byteOffset + raw.byteLength);
            const rawProp = `${field}Raw`;
            inst[rawProp] = ab;
          }
          if (fieldSchema?.node) {
            (inst as Record<string, unknown>)[`${field}Node`] = child;
          }
        }
      }
      return inst;
    };
    return builder.createNode({
      name,
      typeName: nestedSchema.root.typeName,
      expectedTag: nestedSchema.root.expectedTag,
      optional,
      default: item.defaultValue,
      children: nestedSchema.root.children,
      isChoice: nestedSchema.root.isChoice,
      decoder: complexDecoder,
    });
  }

  private createRepeatedNode(
    builder: SchemaBuilder,
    childNode: CompiledSchemaNode,
    item: IAsnSchemaItem,
    name: string,
  ): CompiledSchemaNode {
    const containerType = item.repeated === "set" ? "SET OF" : "SEQUENCE OF";

    // Decoder for repeated containers: decode each element child using ctx.decode
    const repeatedDecoder = (ctx: ParseContext, node: AsnNode) => {
      const out: unknown[] = [];
      const elements = node.children || [];
      for (const el of elements) {
        out.push(ctx.decode(el));
      }
      return out;
    };

    return builder.createNode({
      name,
      typeName: `${containerType} ${childNode.typeName}`,
      expectedTag:
        item.repeated === "set"
          ? { cls: 0, tag: 17, constructed: true } // SET
          : { cls: 0, tag: 16, constructed: true }, // SEQUENCE
      optional: !!item.optional || item.defaultValue !== undefined,
      children: [childNode],
      decoder: repeatedDecoder,
    });
  }

  private createContextSpecificNode(
    builder: SchemaBuilder,
    childNode: CompiledSchemaNode,
    item: IAsnSchemaItem,
    name: string,
  ): CompiledSchemaNode {
    const optional = !!item.optional || item.defaultValue !== undefined;

    if (item.implicit) {
      // IMPLICIT tagging should replace the tag on the underlying node while preserving
      // whether the value is constructed and its children/decoder behavior.
      const isConstructed = childNode.expectedTag
        ? !!childNode.expectedTag.constructed
        : (childNode.children?.length ?? 0) > 0;

      // If the child is constructed (e.g., SEQUENCE/SET or repeated container),
      // keep its children. For primitives, keep a simple wrapper decoder.
      if ((childNode.children?.length ?? 0) > 0) {
        // Use the original child's decoder to decode this implicitly tagged constructed value
        const constructedDecoder = childNode.decoder
          ? childNode.decoder
          : (ctx: ParseContext, node: AsnNode) => {
              // Fallback: if it's a repeated container
              const typeName = childNode.typeName || "";
              if (typeName.includes("SEQUENCE OF") || typeName.includes("SET OF")) {
                const out: unknown[] = [];
                for (const el of node.children || []) {
                  out.push(ctx.decode(el));
                }
                return out;
              }
              // Generic object decode using bound field names
              const obj: Record<string, unknown> = {};
              for (const ch of node.children || []) {
                const k = ch.fieldName || "";
                if (!k) continue;
                obj[k] = ctx.decode(ch);
              }
              return obj;
            };
        return builder.createNode({
          name,
          typeName: childNode.typeName,
          expectedTag: { cls: 2, tag: item.context!, constructed: true },
          tagging: "implicit",
          optional,
          default: item.defaultValue,
          children: childNode.children,
          decoder: constructedDecoder,
        });
      } else {
        // Delegate to child decoder if available (works for convertible types too)
        const primDecoder = (ctx: ParseContext, node: AsnNode) => {
          if (childNode.decoder) {
            return childNode.decoder(ctx, node);
          }
          // Fallback to primitive handling
          if (item.converter) {
            return item.converter.fromASN({ node, context: ctx });
          }
          const dec = this.getDecoderForPrimitiveType(item.type as AsnPropTypes);
          return dec(ctx, node);
        };
        return builder.createNode({
          name,
          typeName: childNode.typeName,
          expectedTag: { cls: 2, tag: item.context!, constructed: isConstructed },
          tagging: "implicit",
          optional,
          default: item.defaultValue,
          decoder: primDecoder,
        });
      }
    } else {
      // EXPLICIT tagging
      // For EXPLICIT tagging, always unwrap and delegate to child decode
      const explicitDecoder = (ctx: ParseContext, node: AsnNode) => {
        if (node.children && node.children.length === 1) {
          return ctx.decode(node.children[0]);
        }
        throw new Error(`Invalid explicit tagging for ${name}`);
      };

      return builder.createNode({
        name,
        typeName: childNode.typeName,
        expectedTag: { cls: 2, tag: item.context!, constructed: true },
        tagging: "explicit",
        optional,
        default: item.defaultValue,
        decoder: explicitDecoder,
        children: [childNode],
      });
    }
  }

  private createRootNode(
    builder: SchemaBuilder,
    schema: IAsnSchema,
    children: CompiledSchemaNode[],
    targetCtor: IEmptyConstructor,
  ): CompiledSchemaNode {
    switch (schema.type) {
      case AsnTypeTypes.Sequence: {
        // Support Sequence OF when schema.itemType is present
        if (schema.itemType && !children.length) {
          // Build item schema node
          const itemNode = this.buildNodeForItem(builder, schema.itemType, "item");
          children = [itemNode];
        }
        const rootNode = builder.createNode({
          name: "",
          typeName:
            schema.itemType && children.length === 1
              ? `SEQUENCE OF ${children[0].typeName}`
              : "SEQUENCE",
          expectedTag: { cls: 0, tag: 16, constructed: true },
          children,
          decoder: (ctx: ParseContext, node: AsnNode) => {
            const inst = new targetCtor() as unknown;
            if (inst instanceof AsnArray) {
              const out = inst as AsnArray<unknown>;
              for (const child of node.children || []) {
                out.push(ctx.decode(child));
              }
              return out;
            }
            const obj = inst as Record<string, unknown>;
            const lazyCache = new WeakMap<object, Map<string, unknown>>();
            const getCacheFor = (o: object) => {
              let map = lazyCache.get(o);
              if (!map) {
                map = new Map<string, unknown>();
                lazyCache.set(o, map);
              }
              return map;
            };
            for (const child of node.children || []) {
              const key = child.fieldName || "";
              if (!key) continue;
              const rootSchema = this.items.get(targetCtor as unknown as object);
              const fieldSchema = rootSchema?.items?.[key];
              if (fieldSchema?.lazy) {
                const raw = ctx.sliceRaw(child);
                const rawView = raw.buffer.slice(raw.byteOffset, raw.byteOffset + raw.byteLength);
                const decodeChild = () => ctx.decode(child);
                const cache = getCacheFor(obj);
                Object.defineProperty(obj, key, {
                  configurable: true,
                  enumerable: true,
                  get() {
                    if (cache.has(key)) return cache.get(key);
                    const v = decodeChild();
                    cache.set(key, v as unknown);
                    return v as unknown;
                  },
                  set(v: unknown) {
                    cache.set(key, v);
                  },
                });
                if (fieldSchema?.raw) {
                  (obj as Record<string, unknown>)[`${key}Raw`] = rawView;
                }
                if (fieldSchema?.node) {
                  (obj as Record<string, unknown>)[`${key}Node`] = child;
                }
              } else {
                obj[key] = ctx.decode(child);
                if (fieldSchema?.raw) {
                  const raw = ctx.sliceRaw(child);
                  const ab = raw.buffer.slice(raw.byteOffset, raw.byteOffset + raw.byteLength);
                  (obj as Record<string, unknown>)[`${key}Raw`] = ab;
                }
                if (fieldSchema?.node) {
                  (obj as Record<string, unknown>)[`${key}Node`] = child;
                }
              }
            }
            return inst;
          },
        });
        return rootNode;
      }
      case AsnTypeTypes.Set: {
        // Support Set OF when schema.itemType is present
        if (schema.itemType && !children.length) {
          const itemNode = this.buildNodeForItem(builder, schema.itemType, "item");
          children = [itemNode];
        }
        const rootSetNode = builder.createNode({
          name: "",
          typeName:
            schema.itemType && children.length === 1 ? `SET OF ${children[0].typeName}` : "SET",
          expectedTag: { cls: 0, tag: 17, constructed: true },
          children,
          decoder: (ctx: ParseContext, node: AsnNode) => {
            const inst = new targetCtor() as unknown;
            if (inst instanceof AsnArray) {
              const out = inst as AsnArray<unknown>;
              for (const child of node.children || []) {
                out.push(ctx.decode(child));
              }
              return out;
            }
            const obj = inst as Record<string, unknown>;
            for (const child of node.children || []) {
              const key = child.fieldName || "";
              if (!key) continue;
              obj[key] = ctx.decode(child);
              // capture raw for fields with raw:true
              const rootSchema = this.items.get(targetCtor as unknown as object);
              const fieldSchema = rootSchema?.items?.[key];
              if (fieldSchema?.raw) {
                const raw = ctx.sliceRaw(child);
                const ab = raw.buffer.slice(raw.byteOffset, raw.byteOffset + raw.byteLength);
                (obj as Record<string, unknown>)[`${key}Raw`] = ab;
              }
            }
            return inst;
          },
        });
        return rootSetNode;
      }
      case AsnTypeTypes.Choice: {
        // CHOICE at root level: decode to instance of targetCtor with one selected property
        const choiceDecoder = (ctx: ParseContext, node: AsnNode) => {
          const inst = new targetCtor() as Record<string, unknown>;
          const tagKey = (node.tagClass << 16) | (node.type << 8) | (node.constructed ? 1 : 0);
          let matched: CompiledSchemaNode | undefined;
          for (const ch of children) {
            if (!ch.expectedTag) continue;
            const k =
              (ch.expectedTag.cls << 16) |
              (ch.expectedTag.tag << 8) |
              (ch.expectedTag.constructed ? 1 : 0);
            if (k === tagKey) {
              matched = ch;
              break;
            }
          }
          if (!matched) {
            matched = children.find((c) => !c.expectedTag);
          }
          if (!matched) {
            return inst;
          }
          // Decode using matched decoder to respect explicit converters
          let value: unknown = matched.decoder ? matched.decoder(ctx, node) : ctx.decode(node);
          // If it's a universal INTEGER and the decoded value is a number or string,
          // normalize to number|bigint for legacy behavior in simple CHOICEs.
          if (
            matched.expectedTag &&
            matched.expectedTag.cls === 0 &&
            matched.expectedTag.tag === 2
          ) {
            if (typeof value === "string") {
              // Default integer converter returns string for large numbers
              try {
                value = BigInt(value);
              } catch {
                // leave as-is if cannot convert
              }
            }
            // If value is number or bigint, keep it. If it's something else (e.g., ArrayBuffer
            // from an explicit converter), do not coerce.
          }
          inst[matched.name] = value as unknown;
          return inst;
        };

        return builder.createNode({
          name: "",
          typeName: "CHOICE",
          isChoice: true,
          children,
          decoder: choiceDecoder,
        });
      }
      default:
        throw new Error(`Unsupported ASN1 type: ${schema.type}`);
    }
  }

  private buildNodeForItem(
    builder: SchemaBuilder,
    itemType: AsnPropTypes | IEmptyConstructor,
    name: string,
  ): CompiledSchemaNode {
    const item: IAsnSchemaItem = {
      type: itemType,
      optional: false,
    } as IAsnSchemaItem;
    if (typeof itemType === "number") {
      // ensure default converter
      item.converter = defaultConverter(itemType as AsnPropTypes) || undefined;
      item.hasExplicitConverter = false;
      return this.createPrimitiveNode(builder, item, name);
    } else if (isConvertible(itemType)) {
      // Convertible type wrapper schema
      const instance = new (itemType as unknown as IEmptyConstructor)();
      // @ts-expect-error convertible provides toSchema(name)
      const convSchema = instance.toSchema?.(name);
      if (!convSchema || !convSchema.root?.expectedTag) {
        throw new Error("Convertible type doesn't provide schema");
      }
      const wrapDecoder = (ctx: ParseContext, node: AsnNode) => ({ node, context: ctx });
      return builder.createNode({
        name,
        typeName: convSchema.root.typeName,
        expectedTag: convSchema.root.expectedTag,
        decoder: wrapDecoder,
      });
    } else {
      // Complex type
      return this.createComplexNode(builder, item, name);
    }
  }

  private getAsnTypeInfo(type: AsnPropTypes): {
    typeName: string;
    expectedTag?: { cls: number; tag: number; constructed: boolean };
  } {
    switch (type) {
      case AsnPropTypes.Boolean:
        return { typeName: "BOOLEAN", expectedTag: { cls: 0, tag: 1, constructed: false } };
      case AsnPropTypes.Integer:
        return { typeName: "INTEGER", expectedTag: { cls: 0, tag: 2, constructed: false } };
      case AsnPropTypes.BitString:
        return { typeName: "BIT STRING", expectedTag: { cls: 0, tag: 3, constructed: false } };
      case AsnPropTypes.OctetString:
        return { typeName: "OCTET STRING", expectedTag: { cls: 0, tag: 4, constructed: false } };
      case AsnPropTypes.Null:
        return { typeName: "NULL", expectedTag: { cls: 0, tag: 5, constructed: false } };
      case AsnPropTypes.ObjectIdentifier:
        return {
          typeName: "OBJECT IDENTIFIER",
          expectedTag: { cls: 0, tag: 6, constructed: false },
        };
      case AsnPropTypes.Utf8String:
        return { typeName: "UTF8String", expectedTag: { cls: 0, tag: 12, constructed: false } };
      case AsnPropTypes.NumericString:
        return { typeName: "NumericString", expectedTag: { cls: 0, tag: 18, constructed: false } };
      case AsnPropTypes.PrintableString:
        return {
          typeName: "PrintableString",
          expectedTag: { cls: 0, tag: 19, constructed: false },
        };
      case AsnPropTypes.TeletexString:
        return { typeName: "TeletexString", expectedTag: { cls: 0, tag: 20, constructed: false } };
      case AsnPropTypes.VideotexString:
        return { typeName: "VideotexString", expectedTag: { cls: 0, tag: 21, constructed: false } };
      case AsnPropTypes.IA5String:
        return { typeName: "IA5String", expectedTag: { cls: 0, tag: 22, constructed: false } };
      case AsnPropTypes.UTCTime:
        return { typeName: "UTCTime", expectedTag: { cls: 0, tag: 23, constructed: false } };
      case AsnPropTypes.GeneralizedTime:
        return {
          typeName: "GeneralizedTime",
          expectedTag: { cls: 0, tag: 24, constructed: false },
        };
      case AsnPropTypes.GraphicString:
        return { typeName: "GraphicString", expectedTag: { cls: 0, tag: 25, constructed: false } };
      case AsnPropTypes.VisibleString:
        return { typeName: "VisibleString", expectedTag: { cls: 0, tag: 26, constructed: false } };
      case AsnPropTypes.GeneralString:
        return { typeName: "GeneralString", expectedTag: { cls: 0, tag: 27, constructed: false } };
      case AsnPropTypes.UniversalString:
        return {
          typeName: "UniversalString",
          expectedTag: { cls: 0, tag: 28, constructed: false },
        };
      case AsnPropTypes.BmpString:
        return { typeName: "BMPString", expectedTag: { cls: 0, tag: 30, constructed: false } };
      case AsnPropTypes.CharacterString:
        return {
          typeName: "CharacterString",
          expectedTag: { cls: 0, tag: 29, constructed: false },
        };
      case AsnPropTypes.Any:
        return { typeName: "ANY", expectedTag: undefined }; // ANY should not have expectedTag constraint
      case AsnPropTypes.Enumerated:
        return { typeName: "ENUMERATED", expectedTag: { cls: 0, tag: 10, constructed: false } };
      default:
        throw new Error(`Unknown ASN.1 type: ${type}`);
    }
  }

  private getDecoderForPrimitiveType(
    type: AsnPropTypes,
  ): (ctx: ParseContext, node: AsnNode) => unknown {
    // For now, ignore custom converters to avoid recursion
    // Custom converters should be handled at a higher level
    // Use default decoder from AsnDecoders
    switch (type) {
      case AsnPropTypes.Boolean:
        return AsnDecoders.decodeBoolean;
      case AsnPropTypes.Integer:
        return AsnDecoders.decodeInteger;
      case AsnPropTypes.BitString:
        return AsnDecoders.decodeBitString;
      case AsnPropTypes.OctetString:
        return AsnDecoders.decodeOctetString;
      case AsnPropTypes.Null:
        return AsnDecoders.decodeNull;
      case AsnPropTypes.ObjectIdentifier:
        return AsnDecoders.decodeObjectIdentifier;
      case AsnPropTypes.Utf8String:
        return AsnDecoders.decodeUtf8String;
      case AsnPropTypes.NumericString:
        return AsnDecoders.decodeNumericString;
      case AsnPropTypes.PrintableString:
        return AsnDecoders.decodePrintableString;
      case AsnPropTypes.TeletexString:
        return AsnDecoders.decodeTeletexString;
      case AsnPropTypes.VideotexString:
        return AsnDecoders.decodeVideotexString;
      case AsnPropTypes.IA5String:
        return AsnDecoders.decodeIa5String;
      case AsnPropTypes.UTCTime:
        return AsnDecoders.decodeUtcTime;
      case AsnPropTypes.GeneralizedTime:
        return AsnDecoders.decodeGeneralizedTime;
      case AsnPropTypes.VisibleString:
        return AsnDecoders.decodeVisibleString;
      case AsnPropTypes.GraphicString:
        return AsnDecoders.decodeGraphicString;
      case AsnPropTypes.GeneralString:
        return AsnDecoders.decodeGeneralString;
      case AsnPropTypes.UniversalString:
        return AsnDecoders.decodeUniversalString;
      case AsnPropTypes.BmpString:
        return AsnDecoders.decodeBmpString;
      case AsnPropTypes.CharacterString:
        return AsnDecoders.decodeCharacterString;
      case AsnPropTypes.Enumerated:
        return AsnDecoders.decodeEnumerated;
      case AsnPropTypes.Any:
        // For ANY type, return the complete raw ASN.1 data (including tag and length)
        return (ctx: ParseContext, node: AsnNode) => {
          return ctx.data.slice(node.start, node.end);
        };
      default:
        // For unsupported types, return a function that returns the raw value
        return (ctx: ParseContext, node: AsnNode) => node.valueRaw;
    }
  }

  public set(target: object, schema: IAsnSchema): this {
    this.items.set(target, schema);
    return this;
  }

  protected findParentSchema(target: object): IAsnSchema | null {
    const parent = Object.getPrototypeOf(target);
    if (parent) {
      const schema = this.items.get(parent);
      return schema || this.findParentSchema(parent);
    }
    return null;
  }
}

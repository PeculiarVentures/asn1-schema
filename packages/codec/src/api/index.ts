// New ASN.1 architecture exports (two-phase with schema support)

// Core types
export * from "../types";

// Validation
export * from "../validation/index";

// Schema builder
export * from "../schema-builder";

// Main parser
import { AsnParser, UnifiedParseOptions } from "../core/unified";
export { AsnParser };
export type { UnifiedParseOptions };

// Context and utilities
import { ParseContextImpl } from "../parser-context";
import { SchemaBinder } from "../core/bind";

// Decoders and utilities
import { AsnDecoders } from "../decoders/index";
import { AsnTreeUtils } from "../tree-utils";
import {
  AsnNode,
  BindSchemaOptions,
  CompiledSchema,
  MaterializeOptions,
  ParseContext,
  ParseOptions,
  SerializeOptions,
} from "../types";
import { AsnNodeUtils } from "../node-utils";

// Serializer
import { AsnSerializer } from "../core/serializer";

export { AsnNodeUtils, ParseContextImpl, SchemaBinder, AsnDecoders, AsnTreeUtils, AsnSerializer };

// Main API functions

/**
 * Parse DER data into minimal AST
 */
export function parseDER(input: Uint8Array | string, options?: ParseOptions) {
  if (typeof input === "string") {
    input = AsnNodeUtils.stringToBytes(input);
  }

  input = AsnNodeUtils.toUint8Array(input);

  const unifiedOpts: UnifiedParseOptions = {
    integerAs: options?.integerAs,
    captureRaw: options?.captureRaw,
    capturePolicy: options?.capturePolicy,
    mode: options?.mode,
  };

  return AsnParser.parseDER(input, unifiedOpts);
}

/**
 * Bind schema to AST
 */
export function bindSchema(
  root: AsnNode,
  ctx: ParseContext,
  schema: CompiledSchema,
  options?: BindSchemaOptions,
) {
  const result = SchemaBinder.bindSchema(root, ctx, schema, options);
  // Create new context with schema bound
  const newCtx = new ParseContextImpl(ctx.data, schema);
  return { ...result, ctx: newCtx };
}

/**
 * Decode a node based on available decoders
 */
export function decode<T = unknown>(node: AsnNode, ctx: ParseContext): T {
  return ctx.decode<T>(node);
}

/**
 * Materialize AST into JavaScript object
 */
export function materialize(
  node: AsnNode,
  ctx: ParseContext,
  options?: MaterializeOptions,
): unknown {
  return AsnTreeUtils.materialize(node, ctx, options);
}

/**
 * Parse DER with unified interface (two-phase only)
 */
export function parseUnified(input: Uint8Array | string, options?: UnifiedParseOptions) {
  return AsnParser.parse(input, options);
}

/**
 * Find node by path
 */
export function findByPath(root: AsnNode, path: string): AsnNode | null {
  return AsnTreeUtils.findByPath(root, path);
}

/**
 * Serialize materialized object to ASN.1 node structure
 */
export function serialize(
  data: unknown,
  schema?: CompiledSchema,
  options?: SerializeOptions,
): AsnNode {
  return AsnSerializer.serialize(data, schema, options);
}

/**
 * Serialize materialized object directly to bytes
 */
export function serializeToBytes(
  data: unknown,
  schema?: CompiledSchema,
  options?: SerializeOptions,
): Uint8Array {
  return AsnSerializer.serializeToBytes(data, schema, options);
}

/**
 * Convert ASN.1 node structure to bytes
 */
export function nodeToBytes(node: AsnNode): Uint8Array {
  return AsnSerializer.nodeToBytes(node);
}

// Legacy compatibility types

export interface ASN1Element {
  tagClass: number; // 0..3 (UNIVERSAL/APPLICATION/CONTEXT/PRIVATE)
  type: number; // tag number
  constructed: boolean;
  start: number; // offset of tag
  headerEnd: number; // first byte of content
  end: number; // first byte after content
  children: ASN1Element[] | null;
  value: ASN1Element[] | undefined; // forge-compat: for constructed == children, else undefined
  raw: Uint8Array | null; // captured raw data as Uint8Array
  valueRaw: Uint8Array | null; // captured value data as Uint8Array
}

export interface ParseOptionsLegacy {
  captureRaw?: boolean;
  captureValue?: boolean;
  visitor?: (elem: ASN1Element, data: string) => "descend" | "skip" | void;
}

import { SchemaBuilder } from "../schema-builder"; // ensure SchemaBuilder is exported

export const builder = new SchemaBuilder();

export interface AsnType {
  node: AsnNode;
  context: ParseContext;
}

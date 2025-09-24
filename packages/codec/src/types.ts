// New ASN.1 types for two-phase parsing

/**
 * Capture level for ASN.1 nodes
 */
export type CaptureLevel = "none" | "valueRaw" | "raw" | "decoded";

/**
 * Capture policy for controlling which data to store (enhanced)
 */
export interface CapturePolicy {
  default: CaptureLevel;
  byPath?: Record<string, CaptureLevel>; // "tbsCertificate.subject"
  byType?: Record<string, CaptureLevel>; // "OCTET STRING", "BIT STRING"
  byField?: Record<string, CaptureLevel>; // field name
}

/**
 * Expected tag for schema matching
 */
export interface ExpectedTag {
  cls: number; // tag class
  tag: number; // tag number
  constructed?: boolean;
}

/**
 * Compiled schema node
 */
export interface CompiledSchemaNode {
  id: number; // schemaId
  name: string; // field name
  typeName: string; // base type or constructed type
  expectedTag?: ExpectedTag;
  expectedTagKey?: number; // compiled tag key for fast comparison
  tagging?: "implicit" | "explicit" | null;
  optional?: boolean;
  default?: unknown;
  isChoice?: boolean;
  isSequenceOf?: boolean; // flag for SEQUENCE OF optimization
  choices?: CompiledSchemaNode[];
  choiceTagIndex?: Map<number, CompiledSchemaNode>; // for fast CHOICE lookup
  decoder?: (node: AsnNode) => unknown;
  children?: CompiledSchemaNode[]; // for SEQUENCE/SET/CHOICE
}

/**
 * Compiled schema
 */
export interface CompiledSchema {
  root: CompiledSchemaNode;
  nodes: Map<number, CompiledSchemaNode>; // by id
}

/**
 * Main ASN.1 node (supports schema binding in two-phase mode)
 */
export interface AsnNode {
  // TLV metadata (no copies)
  tagClass: number; // 0..3
  type: number; // tag number
  constructed: boolean;
  start: number; // offset TLV
  headerEnd: number; // offset content start
  end: number; // offset after content

  // Tree structure
  children: AsnNode[] | null;

  // Parse context attached to node to avoid passing ctx separately
  ctx?: ParseContext | null;

  // Schema binding (applied in second phase)
  schemaId: number; // index in compiled schema, -1 if not matched
  fieldName: string | null; // "subject", "tbsCertificate", ...
  typeName: string | null; // "SEQUENCE", "INTEGER", "Name", "TBSCertificate", ...
  isSequenceOf?: boolean; // performance optimization flag

  // Captured data (always available now)
  valueRaw: Uint8Array | null; // content substring
  raw: Uint8Array | null; // TLV substring
  decoded: unknown | null; // lazy, with memo
}

/**
 * Parse context for storing state and helpers
 */
export interface ParseContext {
  data: Uint8Array; // original byte buffer
  schema: CompiledSchema | null; // schema (bound in second phase)
  integerAs?: "auto" | "number" | "bigint"; // control INTEGER decoding

  // Helper methods
  sliceRaw(node: AsnNode): Uint8Array;
  sliceValueRaw(node: AsnNode): Uint8Array;
  decode<T>(node: AsnNode): T;
}

interface AsnTypeDescriptor {
  cls: number;
  tag: number;
  constructed: boolean;
}

/**
 * Schema error information
 */
export interface AsnSchemaError {
  path: string;
  expected: ExpectedTag | null;
  actual: AsnTypeDescriptor;
  position: number;
  message: string;
}

/**
 * Parse result (may include schema errors in two-phase binding)
 */
export interface ParseResult {
  root: AsnNode;
  ctx: ParseContext;
  errors?: AsnSchemaError[];
  remaining?: {
    offset: number;
    bytes: number;
  };
}

/**
 * Parse mode for ASN.1 parsing
 */
export type ParseMode = "der" | "ber";

/**
 * Parse options for parseDER
 */
export interface ParseOptions {
  captureRawTop?: boolean; // convenient for whole-TLV signatures
  integerAs?: "auto" | "number" | "bigint"; // control INTEGER decoding
  captureRaw?: boolean; // whether to capture raw data for all nodes (default: false for performance)
  capturePolicy?: CapturePolicy; // per-node capture policy to control what to capture
  mode?: ParseMode; // parsing mode: 'der' (strict) or 'ber' (lenient), defaults to 'der'
}

/**
 * Bind schema options
 */
export interface BindSchemaOptions {
  mode?: ParseMode; // how strictly to check DEFAULT/OPTIONAL based on parsing mode
}

/**
 * Materialize filter policy for controlling which data to include
 */
export interface MaterializeFilter {
  default: "include" | "exclude";
  byPath?: Record<string, "include" | "exclude">; // "tbsCertificate.subject"
  byType?: Record<string, "include" | "exclude">; // "OCTET STRING", "BIT STRING"
  byField?: Record<string, "include" | "exclude">; // field name
  maxDepth?: number; // limit materialization depth
  includeRaw?: boolean; // include raw data alongside decoded
}

/**
 * Materialize options
 */
export interface MaterializeOptions {
  filter?: MaterializeFilter;
  onlyDecoded?: boolean; // default true - only return decoded values, not raw
}

/**
 * Serialize options
 */
export interface SerializeOptions {
  schema?: CompiledSchema; // schema for validation and encoding
  validateInput?: boolean; // default true - validate input against schema
  derMode?: boolean; // default true - use DER encoding rules (strict)
}

/**
 * Encoder function type
 */
export type EncoderFunction = (value: unknown, ctx?: SerializeContext) => Uint8Array;

/**
 * Serialize context for encoder state
 */
export interface SerializeContext {
  schema?: CompiledSchema;
  derMode: boolean;
  validateInput: boolean;
}

/**
 * ASN.1 tag descriptor for encoding
 */
export interface AsnTag {
  cls: number; // tag class (0-3)
  tag: number; // tag number
  constructed: boolean;
}

export type DumpStyle = "dev" | "plain";

export interface OidRegistry {
  lookup(oid: string): string | undefined;
  register(oid: string, name: string): void;
}

export interface DumpOptions {
  style?: DumpStyle; // "dev" by default
  oidsMode?: "both" | "numeric" | "name"; // "both" by default
  oidRegistry?: OidRegistry; // DefaultOidRegistry by default
  maxDepth?: number; // Infinity by default
  maxItems?: number; // 10 by default
  blobPreview?: { head?: number; tail?: number }; // {head:16, tail:8}
  indent?: number | string; // 2 by default
}

export type TagClass = "universal" | "application" | "context" | "private";

export interface AsnNode {
  // Absolute offsets in the original buffer
  offset: number;        // tag offset
  headerLen: number;     // TL header size (tag+len)
  length: number;        // content length
  tagClass: TagClass;
  tag: number;
  constructed: boolean;
  // For primitive
  value?: Uint8Array;
  // For constructed
  children?: AsnNode[];
}

import { evaluateCapture } from "./core/capture";
import { getTextDecoder } from "./decoders/strings";
import { AsnNode, CapturePolicy, ParseContext, ParseMode } from "./types";

export const DER = "der" as const;

interface LengthDescriptor {
  /**
   * Length of the element in bytes. -1 for indefinite length
   */
  len: number;
  /** Offset after length bytes */
  off: number;
}

/**
 * Utility functions for ASN.1 nodes
 */
export class AsnNodeUtils {
  private static isBufferAvailable(): boolean {
    return typeof globalThis !== "undefined" && "Buffer" in globalThis && !!globalThis.Buffer?.from;
  }

  private static isBuffer(data: unknown): boolean {
    return this.isBufferAvailable() && globalThis.Buffer.isBuffer(data);
  }

  /**
   * Convert buffer to latin1 string - optimized version
   */
  static toLatin1String(buf: Uint8Array): string {
    // Check if Buffer is available (Node.js environment)
    if (this.isBufferAvailable()) {
      // Use Buffer for better performance in Node.js
      return globalThis.Buffer.from(buf.buffer, buf.byteOffset, buf.length).toString("latin1");
    }

    return getTextDecoder("latin1")!.decode(buf);
  }

  static stringToBytes(str: string): Uint8Array {
    // Check if Buffer is available (Node.js environment)
    if (this.isBufferAvailable()) {
      // Use Buffer for better performance in Node.js
      return new Uint8Array(globalThis.Buffer.from(str, "latin1"));
    }

    // Fallback for other environments
    const bytes = new Uint8Array(str.length);
    const len = str.length;
    for (let i = 0; i < len; i++) {
      bytes[i] = str.charCodeAt(i);
    }
    return bytes;
  }

  /**
   * Convert latin1 string to Uint8Array (optimized with Buffer when available)
   */
  static fromLatin1String(str: string): Uint8Array {
    // Check if Buffer is available (Node.js environment)
    if (this.isBufferAvailable()) {
      return new Uint8Array(globalThis.Buffer.from(str, "latin1"));
    }

    // Fallback for other environments
    const buf = new Uint8Array(str.length);
    const len = str.length;
    for (let i = 0; i < len; i++) {
      buf[i] = str.charCodeAt(i) & 0xff;
    }
    return buf;
  }

  /**
   * Create a new AsnNode with stable shape
   */
  static makeNode(): AsnNode {
    return {
      tagClass: 0,
      type: 0,
      constructed: false,
      start: 0,
      headerEnd: 0,
      end: 0,
      children: null,
      schemaId: -1,
      fieldName: null,
      typeName: null,
      isSequenceOf: undefined,
      ctx: null,
      valueRaw: null,
      raw: null,
      decoded: null,
    };
  }

  /**
   * Parse length from data at offset
   */
  static parseLength(data: Uint8Array, off: number, mode: ParseMode = DER): LengthDescriptor {
    const strict = mode === DER;
    if (off >= data.length) throw new Error("ASN.1: truncated length");
    const b = data[off++];
    if (b < 128) return { len: b, off };
    const n = b & 127;
    if (n === 0) {
      if (strict) {
        throw new Error("Indefinite length not supported in DER");
      }
      // Indefinite length - return a special marker
      return { len: -1, off };
    }
    if (off + n > data.length) throw new Error("ASN.1: length overruns buffer");

    // Check for non-minimal length encoding
    if (n > 1 && data[off] === 0) {
      throw new Error("ASN.1: non-minimal length encoding (leading zero)");
    }

    if (n === 1) {
      const len = data[off++];
      // Check if long form was used unnecessarily
      if (len < 128) {
        throw new Error("ASN.1: non-minimal length encoding (long form for short length)");
      }
      return { len, off };
    }
    if (n === 2) {
      const len = (data[off] << 8) | data[off + 1];
      return { len, off: off + 2 };
    }
    let len = 0;
    for (let i = 0; i < n; i++) {
      len = (len << 8) | data[off++];
    }
    return { len, off };
  }

  /**
   * Evaluate capture policy for a node (legacy wrapper)
   */
  static evaluateCapture(
    policy: CapturePolicy,
    path: string | null,
    schemaId: number,
    fieldName?: string,
    typeName?: string,
  ): number {
    return evaluateCapture(policy, path || "", schemaId, fieldName, typeName);
  }

  static equalBuffers(a: Uint8Array, b: Uint8Array): boolean {
    if (a.length !== b.length) return false;
    for (let i = 0; i < a.length; i++) {
      if (a[i] !== b[i]) return false;
    }
    return true;
  }

  /**
   * Ensure data is Uint8Array, converting Buffer if necessary
   */
  static toUint8Array(data: Uint8Array): Uint8Array {
    if (this.isBuffer(data)) {
      return new Uint8Array(data.buffer, data.byteOffset, data.byteLength);
    }
    return data;
  }

  static getContext(node: AsnNode): ParseContext {
    if (node.ctx) {
      return node.ctx;
    }
    throw new Error("AsnNode context (ctx) is not set");
  }

  static sliceValueRaw(node: AsnNode): Uint8Array {
    if (node.ctx) {
      return node.ctx.sliceValueRaw(node);
    } else if (node.valueRaw) {
      return node.valueRaw; // fallback if ctx is missing
    }
    throw new Error("AsnNode context (ctx) is not set, cannot slice value");
  }

  static sliceRaw(node: AsnNode): Uint8Array {
    if (node.ctx) {
      return node.ctx.sliceRaw(node);
    } else if (node.raw) {
      return node.raw; // fallback if ctx is missing
    }
    throw new Error("AsnNode context (ctx) is not set, cannot slice raw");
  }
}

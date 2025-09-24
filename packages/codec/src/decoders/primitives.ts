import { AsnNodeUtils } from "../node-utils";
import { AsnNode } from "../types";

/**
 * Decoders for primitive ASN.1 types
 */
export class PrimitiveDecoders {
  /**
   * Decode INTEGER with fast-path for small numbers
   */
  static decodeInteger(node: AsnNode): bigint | number {
    const integerAs = node.ctx?.integerAs || "auto";
    const bytes = AsnNodeUtils.sliceValueRaw(node);
    if (bytes.length === 0) {
      throw new Error("Invalid INTEGER: empty content");
    }

    const isNegative = (bytes[0] & 0x80) !== 0;

    // Fast path: small integer (positive or negative) -> Number
    // Use stricter size check to avoid 32-bit overflow in JavaScript bitwise operations
    if (bytes.length <= 4 && integerAs !== "bigint") {
      if (!isNegative) {
        // Positive small integer
        let x = 0;
        const len = bytes.length;
        for (let i = 0; i < len; i++) {
          x = (x << 8) | bytes[i];
        }
        return integerAs === "number" ? x : x; // "auto" also returns number for small values
      } else {
        // Negative small integer - decode as two's complement
        let x = 0;
        const len = bytes.length;
        for (let i = 0; i < len; i++) {
          x = (x << 8) | bytes[i];
        }
        // Convert from two's complement to signed integer
        const bitLength = len * 8;
        const mask = (1 << bitLength) - 1;
        x = (x & mask) - (x & (1 << (bitLength - 1))) * 2;
        return integerAs === "number" ? x : x;
      }
    }

    // BigInt path for large numbers (5+ bytes or when explicitly requested)
    let result = 0n;

    if (isNegative) {
      // Two's complement for negative numbers
      const len = bytes.length;
      for (let i = 0; i < len; i++) {
        result = (result << 8n) | BigInt(bytes[i] ^ 0xff);
      }
      result = -(result + 1n);
    } else {
      // Positive number
      const len = bytes.length;
      for (let i = 0; i < len; i++) {
        result = (result << 8n) | BigInt(bytes[i]);
      }
    }

    return result;
  }

  /**
   * Decode BOOLEAN
   */
  static decodeBoolean(node: AsnNode): boolean {
    const bytes = AsnNodeUtils.sliceValueRaw(node);
    if (bytes.length !== 1) {
      throw new Error("Invalid BOOLEAN: must be exactly 1 byte");
    }

    return bytes[0] !== 0;
  }

  /**
   * Decode OCTET STRING
   */
  static decodeOctetString(node: AsnNode): Uint8Array {
    return AsnNodeUtils.sliceValueRaw(node);
  }

  /**
   * Decode BIT STRING
   */
  static decodeBitString(node: AsnNode): {
    unusedBits: number;
    bytes: Uint8Array;
  } {
    const bytes = AsnNodeUtils.sliceValueRaw(node);
    if (bytes.length === 0) {
      throw new Error("Invalid BIT STRING: empty content");
    }

    const unusedBits = bytes[0];
    if (unusedBits > 7) {
      throw new Error("Invalid BIT STRING: unused bits must be 0-7");
    }

    return {
      unusedBits,
      bytes: bytes.subarray(1),
    };
  }

  /**
   * Decode NULL
   */
  static decodeNull(node: AsnNode): null {
    const bytes = AsnNodeUtils.sliceValueRaw(node);
    if (bytes.length !== 0) {
      throw new Error("Invalid NULL: must be empty");
    }

    return null;
  }

  /**
   * Decode OBJECT IDENTIFIER
   */
  static decodeObjectIdentifier(node: AsnNode): string {
    const bytes = AsnNodeUtils.sliceValueRaw(node);
    if (bytes.length === 0) {
      throw new Error("Invalid OBJECT IDENTIFIER: empty content");
    }

    const result: number[] = [];

    // First byte encodes first two arcs
    const firstByte = bytes[0];
    const firstArc = Math.min(2, Math.floor(firstByte / 40));
    const secondArc = firstByte - 40 * firstArc;
    result.push(firstArc);
    result.push(secondArc);

    // Remaining bytes encode subsequent arcs
    let i = 1;
    while (i < bytes.length) {
      let value = 0;
      let byte: number;

      do {
        byte = bytes[i++];
        value = (value << 7) | (byte & 0x7f);
      } while ((byte & 0x80) !== 0 && i < bytes.length);

      result.push(value);
    }

    return result.join(".");
  }

  /**
   * Decode OBJECT IDENTIFIER (alias)
   */
  static decodeOid(node: AsnNode): string {
    return PrimitiveDecoders.decodeObjectIdentifier(node);
  }

  /**
   * Decode ENUMERATED (similar to INTEGER but semantically different)
   */
  static decodeEnumerated(node: AsnNode): bigint | number {
    // ENUMERATED has the same encoding as INTEGER
    return PrimitiveDecoders.decodeInteger(node);
  }

  /**
   * Decode REAL (IEEE 754 floating point or special encoding)
   */
  static decodeReal(node: AsnNode): number {
    const bytes = AsnNodeUtils.sliceValueRaw(node);
    if (bytes.length === 0) {
      throw new Error("Invalid REAL: empty content");
    }

    // Special case: first byte indicates format
    const firstByte = bytes[0];

    // Check for special values (single byte encodings)
    if (bytes.length === 1) {
      if (firstByte === 0x40) return Infinity; // Plus infinity
      if (firstByte === 0x41) return -Infinity; // Minus infinity
      if (firstByte === 0x42) return NaN; // Not a Number
      if (firstByte === 0x43) return -0; // Minus zero
      if (firstByte === 0x00) return 0; // Zero
    }

    // Check for binary encoding (bit 8 set)
    if (firstByte & 0x80) {
      // Binary encoding (most common)
      // For now, we'll implement a simplified decoder
      // Full IEEE 754 binary REAL decoding is complex
      throw new Error("Complex REAL binary encoding not yet supported");
    } else if ((firstByte & 0xc0) === 0x00) {
      // Decimal encoding
      if (bytes.length === 1) {
        return 0; // Zero
      }

      // Parse as decimal string (simplified)
      const str = String.fromCharCode(...bytes.slice(1));
      const num = parseFloat(str);
      if (isNaN(num)) {
        throw new Error("Invalid REAL decimal encoding");
      }
      return num;
    } else {
      throw new Error("Invalid REAL encoding format");
    }
  }

  /**
   * Decode RELATIVE OBJECT IDENTIFIER
   */
  static decodeRelativeOid(node: AsnNode): string {
    const bytes = AsnNodeUtils.sliceValueRaw(node);

    if (bytes.length === 0) {
      throw new Error("Invalid RELATIVE OBJECT IDENTIFIER: empty content");
    }

    const result: number[] = [];

    // Parse subidentifiers (no special first byte like OID)
    let i = 0;
    while (i < bytes.length) {
      let value = 0;
      let byte: number;

      do {
        byte = bytes[i++];
        value = (value << 7) | (byte & 0x7f);
      } while ((byte & 0x80) !== 0 && i < bytes.length);

      result.push(value);
    }

    return result.join(".");
  }
}

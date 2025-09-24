import { AsnTag } from "../types";
import { TlvEncoder } from "../core/encoder";

/**
 * Encoders for primitive ASN.1 types - optimized for performance
 */
export class PrimitiveEncoders {
  /**
   * Encode INTEGER value to ASN.1 DER
   */
  static encodeInteger(value: number | bigint): Uint8Array {
    if (typeof value === "number") {
      // Fast path for small integers
      if (Number.isInteger(value) && value >= -2147483648 && value <= 2147483647) {
        return this.encodeSmallInteger(value);
      }
      // Convert to bigint for large numbers
      value = BigInt(value);
    }

    return this.encodeBigInteger(value);
  }

  /**
   * Encode small integer (fast path)
   */
  private static encodeSmallInteger(value: number): Uint8Array {
    if (value === 0) {
      return new Uint8Array([0]);
    }

    const isNegative = value < 0;
    const absValue = Math.abs(value);

    // Calculate byte count needed
    let byteCount = 0;
    let temp = absValue;
    while (temp > 0) {
      byteCount++;
      temp >>>= 8;
    }

    // Check if we need extra byte for sign bit
    const highBit = (absValue >>> ((byteCount - 1) * 8)) & 0x80;
    if (!isNegative && highBit) {
      byteCount++;
    }

    const result = new Uint8Array(byteCount);

    if (isNegative) {
      // Two's complement for negative numbers
      let carry = 1;
      for (let i = byteCount - 1; i >= 0; i--) {
        const byte = (absValue >>> (i * 8)) & 0xff;
        const inverted = (~byte + carry) & 0xff;
        carry = inverted === 0 && carry === 1 ? 1 : 0;
        result[byteCount - 1 - i] = inverted;
      }
    } else {
      // Positive number - pad with zero if needed
      for (let i = 0; i < byteCount; i++) {
        result[i] = (absValue >>> ((byteCount - 1 - i) * 8)) & 0xff;
      }
    }

    return result;
  }

  /**
   * Encode bigint (for large integers)
   */
  private static encodeBigInteger(value: bigint): Uint8Array {
    if (value === 0n) {
      return new Uint8Array([0]);
    }

    let isNegative = false;
    let workingValue = value;

    if (value < 0n) {
      isNegative = true;
      workingValue = -value;
    }

    // Convert to bytes
    const bytes: number[] = [];
    let tempVal = workingValue;

    while (tempVal > 0n) {
      const byteVal = tempVal & 0xffn;
      bytes.unshift(Number(byteVal));
      tempVal = tempVal >> 8n;
    }

    // Check if we need an extra byte for the sign bit
    if (!isNegative && bytes.length > 0 && (bytes[0] & 0x80) !== 0) {
      bytes.unshift(0);
    }

    // Apply two's complement for negative numbers
    if (isNegative) {
      // Invert bits
      for (let i = 0; i < bytes.length; i++) {
        bytes[i] = ~bytes[i] & 0xff;
      }

      // Add 1 (two's complement)
      let carry = 1;
      for (let i = bytes.length - 1; i >= 0 && carry > 0; i--) {
        const sum = bytes[i] + carry;
        bytes[i] = sum & 0xff;
        carry = sum >> 8;
      }

      // If sign bit is still needed
      if ((bytes[0] & 0x80) === 0) {
        bytes.unshift(0xff);
      }
    }

    return new Uint8Array(bytes);
  }

  /**
   * Encode BOOLEAN value
   */
  static encodeBoolean(value: boolean): Uint8Array {
    return new Uint8Array([value ? 0xff : 0x00]);
  }

  /**
   * Encode NULL value
   */
  static encodeNull(): Uint8Array {
    return new Uint8Array(0);
  }

  /**
   * Encode OCTET STRING
   */
  static encodeOctetString(value: Uint8Array): Uint8Array {
    return new Uint8Array(value); // Direct copy
  }

  /**
   * Encode BIT STRING
   */
  static encodeBitString(value: { unusedBits: number; bytes: Uint8Array }): Uint8Array {
    if (value.unusedBits < 0 || value.unusedBits > 7) {
      throw new Error("BIT STRING unusedBits must be 0-7");
    }

    const result = new Uint8Array(1 + value.bytes.length);
    result[0] = value.unusedBits;
    result.set(value.bytes, 1);
    return result;
  }

  /**
   * Encode OBJECT IDENTIFIER
   */
  static encodeObjectIdentifier(value: string): Uint8Array {
    const parts = value.split(".").map(Number);

    if (parts.length < 2) {
      throw new Error("OID must have at least 2 components");
    }

    if (parts[0] < 0 || parts[0] > 2) {
      throw new Error("First OID component must be 0, 1, or 2");
    }

    if (parts[0] < 2 && parts[1] > 39) {
      throw new Error("Second OID component must be 0-39 when first is 0 or 1");
    }

    const bytes: number[] = [];

    // Encode first two components combined using base-128 per X.690
    // Note: (first * 40 + second) can exceed 127 when first=2 and second>=40
    const firstCombined = parts[0] * 40 + parts[1];
    bytes.push(...this.encodeOidComponent(firstCombined));

    // Encode remaining components
    for (let i = 2; i < parts.length; i++) {
      const component = parts[i];
      if (component < 0) {
        throw new Error("OID components must be non-negative");
      }

      if (component < 128) {
        bytes.push(component);
      } else {
        // Multi-byte encoding
        const encoded = this.encodeOidComponent(component);
        bytes.push(...encoded);
      }
    }

    return new Uint8Array(bytes);
  }

  /**
   * Encode single OID component (for values >= 128)
   */
  private static encodeOidComponent(value: number): number[] {
    if (value < 0) {
      throw new Error("OID component must be non-negative");
    }
    // Collect 7-bit chunks from least significant to most
    const chunks: number[] = [];
    do {
      chunks.push(value & 0x7f);
      value >>>= 7;
    } while (value > 0);
    // Reverse to most-significant-first and set continuation bit on all but last
    chunks.reverse();
    for (let i = 0; i < chunks.length - 1; i++) {
      chunks[i] |= 0x80;
    }
    return chunks;
  }

  /**
   * Encode ENUMERATED (same as INTEGER)
   */
  static encodeEnumerated(value: number | bigint): Uint8Array {
    return this.encodeInteger(value);
  }

  /**
   * Encode REAL (simplified - only decimal form)
   */
  static encodeReal(value: number): Uint8Array {
    if (value === 0) {
      return new Uint8Array([0x00]);
    }

    if (value === Infinity) {
      return new Uint8Array([0x40]);
    }

    if (value === -Infinity) {
      return new Uint8Array([0x41]);
    }

    if (isNaN(value)) {
      return new Uint8Array([0x42]);
    }

    if (Object.is(value, -0)) {
      return new Uint8Array([0x43]);
    }

    // Decimal encoding (simplified)
    const str = value.toString();
    const strBytes = new TextEncoder().encode(str);

    const result = new Uint8Array(1 + strBytes.length);
    result[0] = 0x03; // Decimal encoding
    result.set(strBytes, 1);

    return result;
  }

  /**
   * Create complete TLV for primitive type
   */
  static encodePrimitiveTlv(tag: AsnTag, content: Uint8Array): Uint8Array {
    return TlvEncoder.encodeTlv(tag, content);
  }
}

import { AsnTag } from "../types";

/**
 * ASN.1 TLV encoding utilities - optimized for performance
 */
export class TlvEncoder {
  /**
   * Encode tag (T in TLV) - optimized for common cases
   */
  static encodeTag(tag: AsnTag): Uint8Array {
    const { cls, tag: tagNum, constructed } = tag;

    // Fast path for short form tags (< 31)
    if (tagNum < 31) {
      const byte = (cls << 6) | (constructed ? 0x20 : 0x00) | tagNum;
      return new Uint8Array([byte]);
    }

    // Long form encoding for tags >= 31
    const firstByte = (cls << 6) | (constructed ? 0x20 : 0x00) | 0x1f;
    const tagBytes = this.encodeLongFormNumber(tagNum);

    const result = new Uint8Array(1 + tagBytes.length);
    result[0] = firstByte;
    result.set(tagBytes, 1);

    return result;
  }

  /**
   * Encode length (L in TLV) - DER compliant
   */
  static encodeLength(length: number): Uint8Array {
    if (length < 0) {
      throw new Error("Length cannot be negative");
    }

    // Short form: length 0-127
    if (length < 0x80) {
      return new Uint8Array([length]);
    }

    // Long form: length >= 128
    // Calculate number of bytes needed
    let temp = length;
    let byteCount = 0;
    while (temp > 0) {
      temp >>>= 8;
      byteCount++;
    }

    if (byteCount > 127) {
      throw new Error("Length too large for DER encoding");
    }

    const result = new Uint8Array(1 + byteCount);
    result[0] = 0x80 | byteCount; // Long form marker + byte count

    // Encode length bytes (big-endian)
    temp = length;
    for (let i = byteCount; i > 0; i--) {
      result[i] = temp & 0xff;
      temp >>>= 8;
    }

    return result;
  }

  /**
   * Encode complete TLV structure
   */
  static encodeTlv(tag: AsnTag, content: Uint8Array): Uint8Array {
    const tagBytes = this.encodeTag(tag);
    const lengthBytes = this.encodeLength(content.length);

    const result = new Uint8Array(tagBytes.length + lengthBytes.length + content.length);
    let offset = 0;

    result.set(tagBytes, offset);
    offset += tagBytes.length;

    result.set(lengthBytes, offset);
    offset += lengthBytes.length;

    result.set(content, offset);

    return result;
  }

  /**
   * Encode number in long form (for tags >= 31)
   */
  private static encodeLongFormNumber(num: number): Uint8Array {
    if (num < 31) {
      throw new Error("Long form encoding not needed for numbers < 31");
    }

    // Calculate bytes needed
    const bytes: number[] = [];
    let temp = num;

    // Extract 7-bit groups (little-endian order)
    while (temp > 0) {
      bytes.push(temp & 0x7f);
      temp >>>= 7;
    }

    // Reverse to big-endian and set continuation bits
    const result = new Uint8Array(bytes.length);
    for (let i = 0; i < bytes.length; i++) {
      const byteValue = bytes[bytes.length - 1 - i];
      // Set continuation bit for all bytes except the last
      result[i] = i < bytes.length - 1 ? byteValue | 0x80 : byteValue;
    }

    return result;
  }

  /**
   * Calculate encoded size without actually encoding (optimization)
   */
  static calculateTlvSize(tag: AsnTag, contentLength: number): number {
    const tagSize = tag.tag < 31 ? 1 : this.calculateLongFormTagSize(tag.tag);
    const lengthSize = this.calculateLengthSize(contentLength);
    return tagSize + lengthSize + contentLength;
  }

  /**
   * Calculate tag size for long form
   */
  private static calculateLongFormTagSize(tagNum: number): number {
    if (tagNum < 31) return 1;

    let size = 1; // First byte with 0x1f
    let temp = tagNum;
    while (temp > 0) {
      size++;
      temp >>>= 7;
    }
    return size;
  }

  /**
   * Calculate length encoding size
   */
  private static calculateLengthSize(length: number): number {
    if (length < 0x80) return 1;

    let byteCount = 0;
    let temp = length;
    while (temp > 0) {
      byteCount++;
      temp >>>= 8;
    }
    return 1 + byteCount; // Length byte + actual length bytes
  }
}

/**
 * Optimized buffer builder for ASN.1 encoding
 */
export class AsnBuffer {
  private chunks: Uint8Array[] = [];
  private totalSize = 0;

  /**
   * Append bytes to buffer
   */
  append(bytes: Uint8Array): void {
    this.chunks.push(bytes);
    this.totalSize += bytes.length;
  }

  /**
   * Append single byte
   */
  appendByte(byte: number): void {
    this.chunks.push(new Uint8Array([byte]));
    this.totalSize += 1;
  }

  /**
   * Prepend bytes to buffer (less efficient, use sparingly)
   */
  prepend(bytes: Uint8Array): void {
    this.chunks.unshift(bytes);
    this.totalSize += bytes.length;
  }

  /**
   * Get total size
   */
  size(): number {
    return this.totalSize;
  }

  /**
   * Convert to single Uint8Array
   */
  toUint8Array(): Uint8Array {
    if (this.chunks.length === 0) {
      return new Uint8Array(0);
    }

    if (this.chunks.length === 1) {
      return this.chunks[0];
    }

    const result = new Uint8Array(this.totalSize);
    let offset = 0;

    for (const chunk of this.chunks) {
      result.set(chunk, offset);
      offset += chunk.length;
    }

    return result;
  }

  /**
   * Clear buffer
   */
  clear(): void {
    this.chunks.length = 0;
    this.totalSize = 0;
  }

  /**
   * Create buffer from multiple arrays (static utility)
   */
  static concat(arrays: Uint8Array[]): Uint8Array {
    if (arrays.length === 0) return new Uint8Array(0);
    if (arrays.length === 1) return arrays[0];

    const totalLength = arrays.reduce((sum, arr) => sum + arr.length, 0);
    const result = new Uint8Array(totalLength);

    let offset = 0;
    for (const arr of arrays) {
      result.set(arr, offset);
      offset += arr.length;
    }

    return result;
  }
}

import { SerializeContext, AsnTag } from "../types";
import { TlvEncoder } from "../core/encoder";

/**
 * Encoders for ASN.1 string types - optimized for performance
 */
export class StringEncoders {
  /**
   * Encode UTF8String
   */
  static encodeUtf8String(value: string): Uint8Array {
    return new TextEncoder().encode(value);
  }

  /**
   * Encode PrintableString
   */
  static encodePrintableString(value: string): Uint8Array {
    // Validate PrintableString character set
    const printableChars = /^[A-Za-z0-9 '()+,\-./:=?]*$/;
    if (!printableChars.test(value)) {
      throw new Error("Invalid characters for PrintableString");
    }

    return new TextEncoder().encode(value);
  }

  /**
   * Encode IA5String (ASCII)
   */
  static encodeIa5String(value: string): Uint8Array {
    // Validate ASCII range
    for (let i = 0; i < value.length; i++) {
      const code = value.charCodeAt(i);
      if (code > 127) {
        throw new Error(`Invalid character for IA5String at position ${i}: code ${code}`);
      }
    }

    return new TextEncoder().encode(value);
  }

  /**
   * Encode BMPString (UTF-16BE)
   */
  static encodeBmpString(value: string): Uint8Array {
    const result = new Uint8Array(value.length * 2);

    for (let i = 0; i < value.length; i++) {
      const code = value.charCodeAt(i);
      // Check for surrogate pairs (not allowed in BMPString)
      if (code >= 0xd800 && code <= 0xdfff) {
        throw new Error(`Surrogate character not allowed in BMPString at position ${i}`);
      }

      result[i * 2] = (code >>> 8) & 0xff;
      result[i * 2 + 1] = code & 0xff;
    }

    return result;
  }

  /**
   * Encode NumericString (digits and space only)
   */
  static encodeNumericString(value: string): Uint8Array {
    // Validate numeric string character set
    const numericChars = /^[0-9 ]*$/;
    if (!numericChars.test(value)) {
      throw new Error("Invalid characters for NumericString - only digits and spaces allowed");
    }

    return new TextEncoder().encode(value);
  }

  /**
   * Encode TeletexString (T.61, fallback to Latin-1)
   */
  static encodeTeletexString(value: string): Uint8Array {
    // Check for null bytes
    if (value.includes("\0")) {
      throw new Error("TeletexString cannot contain null bytes");
    }

    // Use Latin-1 encoding as fallback
    const result = new Uint8Array(value.length);
    for (let i = 0; i < value.length; i++) {
      const code = value.charCodeAt(i);
      if (code > 255) {
        throw new Error(`Character at position ${i} cannot be encoded in Latin-1`);
      }
      result[i] = code;
    }

    return result;
  }

  /**
   * Encode VisibleString (graphic characters and space)
   */
  static encodeVisibleString(value: string): Uint8Array {
    // Validate visible string character set (0x20-0x7E)
    for (let i = 0; i < value.length; i++) {
      const code = value.charCodeAt(i);
      if (code < 0x20 || code > 0x7e) {
        throw new Error(`Invalid character for VisibleString at position ${i}: code ${code}`);
      }
    }

    return new TextEncoder().encode(value);
  }

  /**
   * Encode GeneralString (arbitrary character set, prefer UTF-8)
   */
  static encodeGeneralString(value: string): Uint8Array {
    if (value.length === 0) {
      throw new Error("GeneralString cannot be empty");
    }

    return new TextEncoder().encode(value);
  }

  /**
   * Encode UniversalString (UTF-32BE)
   */
  static encodeUniversalString(value: string): Uint8Array {
    const codePoints: number[] = [];

    // Convert string to array of Unicode code points
    for (let i = 0; i < value.length; i++) {
      const code = value.codePointAt(i);
      if (code === undefined) break;

      codePoints.push(code);

      // Skip the next character if it's part of a surrogate pair
      if (code > 0xffff) {
        i++;
      }
    }

    const result = new Uint8Array(codePoints.length * 4);

    for (let i = 0; i < codePoints.length; i++) {
      const code = codePoints[i];
      const offset = i * 4;

      result[offset] = (code >>> 24) & 0xff;
      result[offset + 1] = (code >>> 16) & 0xff;
      result[offset + 2] = (code >>> 8) & 0xff;
      result[offset + 3] = code & 0xff;
    }

    return result;
  }

  /**
   * Encode CharacterString (complex type, simplified as UTF-8)
   */
  static encodeCharacterString(value: string): Uint8Array {
    if (value.length === 0) {
      throw new Error("CharacterString cannot be empty");
    }

    return new TextEncoder().encode(value);
  }

  /**
   * Create complete TLV for string type
   */
  static encodeStringTlv(tag: AsnTag, content: Uint8Array): Uint8Array {
    return TlvEncoder.encodeTlv(tag, content);
  }

  /**
   * Auto-encode string based on content (helper)
   */
  static encodeAutoString(value: string): { tag: AsnTag; content: Uint8Array } {
    // Try to determine best encoding based on content

    // Check if it's ASCII
    const isAscii = /^[\x00-\x7f]*$/.test(value);
    if (isAscii) {
      // Check if it's PrintableString subset
      const isPrintable = /^[A-Za-z0-9 '()+,\-./:=?]*$/.test(value);
      if (isPrintable) {
        return {
          tag: { cls: 0, tag: 19, constructed: false }, // PrintableString
          content: this.encodePrintableString(value),
        };
      }

      // Use IA5String for ASCII
      return {
        tag: { cls: 0, tag: 22, constructed: false }, // IA5String
        content: this.encodeIa5String(value),
      };
    }

    // Use UTF8String for non-ASCII
    return {
      tag: { cls: 0, tag: 12, constructed: false }, // UTF8String
      content: this.encodeUtf8String(value),
    };
  }
}

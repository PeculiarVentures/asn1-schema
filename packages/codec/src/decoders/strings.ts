import { AsnNodeUtils } from "../node-utils";
import { AsnNode } from "../types";

/**
 * Shared text decoder utilities to avoid duplication
 */
type SupportedEncoding = "utf-8" | "ascii" | "latin1" | "utf-16be";

/**
 * Global cache for text decoders
 */
const textDecoders = new Map<SupportedEncoding, typeof TextDecoder.prototype>();

/**
 * Get or create a cached text decoder
 */
export function getTextDecoder(encoding: SupportedEncoding): typeof TextDecoder.prototype | null {
  let decoder = textDecoders.get(encoding);
  if (!decoder) {
    try {
      decoder = new TextDecoder(encoding);
      textDecoders.set(encoding, decoder);
    } catch {
      // Some environments might not support certain encodings
      return null;
    }
  }
  return decoder;
}

/**
 * Decoders for ASN.1 string types
 */
export class StringDecoders {
  /**
   * Decode ASCII string (for multiple ASN.1 types)
   */
  static decodeAsciiString(node: AsnNode): string {
    const bytes = AsnNodeUtils.sliceValueRaw(node);
    const decoder = getTextDecoder("ascii");
    if (!decoder) throw new Error("ASCII TextDecoder not supported");
    return decoder.decode(bytes);
  }
  /**
   * Decode UTF8String
   */
  static decodeUtf8String(node: AsnNode): string {
    const bytes = AsnNodeUtils.sliceValueRaw(node);
    const decoder = getTextDecoder("utf-8");
    if (!decoder) throw new Error("UTF-8 TextDecoder not supported");
    return decoder.decode(bytes);
  }

  /**
   * Decode PrintableString
   */
  static decodePrintableString(node: AsnNode): string {
    const bytes = AsnNodeUtils.sliceValueRaw(node);
    // PrintableString is ASCII subset
    const decoder = getTextDecoder("ascii");
    if (!decoder) throw new Error("ASCII TextDecoder not supported");
    return decoder.decode(bytes);
  }

  /**
   * Decode IA5String
   */
  static decodeIa5String(node: AsnNode): string {
    const bytes = AsnNodeUtils.sliceValueRaw(node);
    // IA5String is ASCII
    const decoder = getTextDecoder("ascii");
    if (!decoder) throw new Error("ASCII TextDecoder not supported");
    return decoder.decode(bytes);
  }

  /**
   * Decode Latin1String (ISO 8859-1)
   */
  static decodeLatin1String(node: AsnNode): string {
    const bytes = AsnNodeUtils.sliceValueRaw(node);
    const decoder = getTextDecoder("latin1");
    if (!decoder) throw new Error("Latin1 TextDecoder not supported");
    return decoder.decode(bytes);
  }

  /**
   * Decode BMPString (Basic Multilingual Plane) with TextDecoder optimization
   */
  static decodeBmpString(node: AsnNode): string {
    const bytes = AsnNodeUtils.sliceValueRaw(node);
    if (bytes.length % 2 !== 0) {
      throw new Error("Invalid BMPString: length must be even");
    }

    // Try native TextDecoder first for better performance
    const decoder = getTextDecoder("utf-16be");
    if (decoder) {
      try {
        return decoder.decode(bytes);
      } catch {
        // Fall through to manual implementation
      }
    }

    // Fallback to manual decoding
    let result = "";
    const len = bytes.length;
    for (let i = 0; i < len; i += 2) {
      const codePoint = (bytes[i] << 8) | bytes[i + 1];
      result += String.fromCharCode(codePoint);
    }

    return result;
  }

  /**
   * Decode NumericString (tag 18) - digits and space only
   */
  static decodeNumericString(node: AsnNode): string {
    const bytes = AsnNodeUtils.sliceValueRaw(node);

    // Validate characters
    for (let i = 0; i < bytes.length; i++) {
      const byte = bytes[i];
      // NumericString: digits (0x30-0x39) and space (0x20) only
      if (!((byte >= 0x30 && byte <= 0x39) || byte === 0x20)) {
        throw new Error(`NumericString contains invalid character 0x${byte.toString(16)}`);
      }
    }

    const decoder = getTextDecoder("ascii");
    if (!decoder) {
      // Fallback to manual decoding
      let result = "";
      for (let i = 0; i < bytes.length; i++) {
        result += String.fromCharCode(bytes[i]);
      }
      return result;
    }
    return decoder.decode(bytes);
  }

  /**
   * Decode TeletexString (tag 20) - T.61 character set (Latin-1 fallback)
   */
  static decodeTeletexString(node: AsnNode): string {
    const bytes = AsnNodeUtils.sliceValueRaw(node);

    // Validate characters - no null bytes
    for (let i = 0; i < bytes.length; i++) {
      const byte = bytes[i];
      if (byte === 0x00) {
        throw new Error("TeletexString contains null byte");
      }
    }

    // TeletexString uses T.61 character set, but Latin-1 is commonly used fallback
    const decoder = getTextDecoder("latin1");
    if (!decoder) {
      // Fallback to manual decoding
      let result = "";
      for (let i = 0; i < bytes.length; i++) {
        result += String.fromCharCode(bytes[i]);
      }
      return result;
    }
    return decoder.decode(bytes);
  }

  /**
   * Decode VisibleString (tag 26) - graphic characters and space (ASCII 0x20-0x7E)
   */
  static decodeVisibleString(node: AsnNode): string {
    const bytes = AsnNodeUtils.sliceValueRaw(node);

    // Validate characters
    for (let i = 0; i < bytes.length; i++) {
      const byte = bytes[i];
      // VisibleString: 0x20-0x7E (space through tilde)
      if (!(byte >= 0x20 && byte <= 0x7e)) {
        throw new Error(`VisibleString contains invalid character 0x${byte.toString(16)}`);
      }
    }

    const decoder = getTextDecoder("ascii");
    if (!decoder) {
      // Fallback to manual decoding
      let result = "";
      for (let i = 0; i < bytes.length; i++) {
        result += String.fromCharCode(bytes[i]);
      }
      return result;
    }
    return decoder.decode(bytes);
  }

  /**
   * Decode GeneralString (tag 27) - arbitrary character set
   */
  static decodeGeneralString(node: AsnNode): string {
    const bytes = AsnNodeUtils.sliceValueRaw(node);

    // GeneralString cannot be empty
    if (bytes.length === 0) {
      throw new Error("GeneralString cannot be empty");
    }

    // GeneralString can contain any character set, try UTF-8 first, then Latin-1
    try {
      const decoder = getTextDecoder("utf-8");
      if (decoder) {
        return decoder.decode(bytes);
      }
    } catch {
      // Fall through to Latin-1
    }

    const decoder = getTextDecoder("latin1");
    if (!decoder) {
      // Fallback to manual decoding
      let result = "";
      for (let i = 0; i < bytes.length; i++) {
        result += String.fromCharCode(bytes[i]);
      }
      return result;
    }
    return decoder.decode(bytes);
  }

  /**
   * Decode UniversalString (tag 28) - UCS-4 (UTF-32BE)
   */
  static decodeUniversalString(node: AsnNode): string {
    const bytes = AsnNodeUtils.sliceValueRaw(node);
    if (bytes.length % 4 !== 0) {
      throw new Error("Invalid UniversalString: length must be multiple of 4");
    }

    // Manual decoding since TextDecoder for UTF-32BE is not widely supported
    let result = "";
    const len = bytes.length;
    for (let i = 0; i < len; i += 4) {
      const codePoint =
        (bytes[i] << 24) | (bytes[i + 1] << 16) | (bytes[i + 2] << 8) | bytes[i + 3];

      // Check for surrogate code points (0xD800-0xDFFF)
      if (codePoint >= 0xd800 && codePoint <= 0xdfff) {
        throw new Error(
          `Invalid UniversalString: contains surrogate code point 0x${codePoint.toString(16)}`,
        );
      }

      if (codePoint <= 0xffff) {
        result += String.fromCharCode(codePoint);
      } else if (codePoint <= 0x10ffff) {
        // Convert to UTF-16 surrogate pair
        const adjusted = codePoint - 0x10000;
        const high = 0xd800 + (adjusted >> 10);
        const low = 0xdc00 + (adjusted & 0x3ff);
        result += String.fromCharCode(high, low);
      } else {
        throw new Error(
          `Invalid UniversalString: code point 0x${codePoint.toString(16)} out of range`,
        );
      }
    }

    return result;
  }

  /**
   * Decode VideotexString (tag 21) - T.100/T.101 character set (Latin-1 fallback)
   */
  static decodeVideotexString(node: AsnNode): string {
    const bytes = AsnNodeUtils.sliceValueRaw(node);

    // VideotexString cannot be empty
    if (bytes.length === 0) {
      throw new Error("VideotexString cannot be empty");
    }

    // VideotexString uses T.100/T.101 character set, Latin-1 is reasonable fallback
    const decoder = getTextDecoder("latin1");
    if (!decoder) {
      // Fallback to manual decoding
      let result = "";
      for (let i = 0; i < bytes.length; i++) {
        result += String.fromCharCode(bytes[i]);
      }
      return result;
    }
    return decoder.decode(bytes);
  }

  /**
   * Decode GraphicString (tag 25) - T.61 character set (Latin-1 fallback)
   */
  static decodeGraphicString(node: AsnNode): string {
    const bytes = AsnNodeUtils.sliceValueRaw(node);

    // GraphicString cannot be empty
    if (bytes.length === 0) {
      throw new Error("GraphicString cannot be empty");
    }

    // GraphicString uses T.61 character set, Latin-1 is reasonable fallback
    const decoder = getTextDecoder("latin1");
    if (!decoder) {
      // Fallback to manual decoding
      let result = "";
      for (let i = 0; i < bytes.length; i++) {
        result += String.fromCharCode(bytes[i]);
      }
      return result;
    }
    return decoder.decode(bytes);
  }

  /**
   * Decode CharacterString (tag 29) - complex type with explicit character set
   */
  static decodeCharacterString(node: AsnNode): string {
    const bytes = AsnNodeUtils.sliceValueRaw(node);

    // CharacterString cannot be empty
    if (bytes.length === 0) {
      throw new Error("CharacterString cannot be empty");
    }

    // CharacterString is a complex constructed type, but for simplicity
    // we'll treat it as a generic string and try UTF-8 first
    const utf8Decoder = getTextDecoder("utf-8");
    if (utf8Decoder) {
      const utf8Result = utf8Decoder.decode(bytes);
      // Check if the result contains replacement characters (indicating invalid UTF-8)
      if (!utf8Result.includes("\uFFFD")) {
        return utf8Result;
      }
      // Fall through to Latin-1 if UTF-8 was invalid
    }

    const decoder = getTextDecoder("latin1");
    if (!decoder) {
      // Fallback to manual decoding
      let result = "";
      for (let i = 0; i < bytes.length; i++) {
        result += String.fromCharCode(bytes[i]);
      }
      return result;
    }
    return decoder.decode(bytes);
  }
}

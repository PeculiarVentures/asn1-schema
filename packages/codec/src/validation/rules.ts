import { AsnNode } from "../types";
import { ValidationRule, ValidationContext, LintIssue, ValidationProfile } from "./types";

/**
 * Helper function to create lint issues
 */
function createIssue(
  rule: string,
  message: string,
  context: ValidationContext,
  node: AsnNode,
  severity: "error" | "warning" | "info" = "error",
): LintIssue {
  return {
    severity,
    rule,
    message,
    path: context.path,
    position: node.start,
    length: node.end - node.start,
    context: {
      tagClass: node.tagClass,
      type: node.type,
      constructed: node.constructed,
    },
  };
}

/**
 * DER/BER validation rules
 */
export const coreValidationRules: ValidationRule[] = [
  // BOOLEAN validation
  {
    id: "BOOLEAN_INVALID_LENGTH",
    description: "BOOLEAN must have length 1",
    profiles: ["der", "ber"],
    level: "basic",
    validate: (node, data, context) => {
      if (node.tagClass !== 0 || node.type !== 1) return null;

      const len = node.end - node.headerEnd;
      if (len !== 1) {
        return createIssue(
          "BOOLEAN_INVALID_LENGTH",
          `BOOLEAN length must be 1, got ${len}`,
          context,
          node,
        );
      }
      return null;
    },
  },

  {
    id: "BOOLEAN_NON_CANONICAL",
    description: "BOOLEAN value must be 0x00 or 0xFF in DER",
    profiles: ["der"],
    level: "strict",
    validate: (node, data, context) => {
      if (node.tagClass !== 0 || node.type !== 1) return null;

      const value = data[node.headerEnd];
      if (value !== 0x00 && value !== 0xff) {
        return createIssue(
          "BOOLEAN_NON_CANONICAL",
          `BOOLEAN value must be 0x00 or 0xFF in DER mode, got 0x${value.toString(16)}`,
          context,
          node,
        );
      }
      return null;
    },
  },

  // INTEGER validation
  {
    id: "INTEGER_EMPTY",
    description: "INTEGER must not be empty",
    profiles: ["der", "ber"],
    level: "basic",
    validate: (node, data, context) => {
      if (node.tagClass !== 0 || node.type !== 2) return null;

      const len = node.end - node.headerEnd;
      if (len === 0) {
        return createIssue("INTEGER_EMPTY", "INTEGER length must be greater than 0", context, node);
      }
      return null;
    },
  },

  {
    id: "INTEGER_NON_MINIMAL",
    description: "INTEGER must use minimal encoding in DER",
    profiles: ["der"],
    level: "strict",
    validate: (node, data, context) => {
      if (node.tagClass !== 0 || node.type !== 2) return null;

      const len = node.end - node.headerEnd;
      if (len <= 1) return null;

      const first = data[node.headerEnd];
      const second = data[node.headerEnd + 1];

      if (first === 0x00 && (second & 0x80) === 0) {
        return createIssue(
          "INTEGER_NON_MINIMAL",
          "INTEGER has unnecessary leading zero",
          context,
          node,
        );
      }
      if (first === 0xff && (second & 0x80) !== 0) {
        return createIssue(
          "INTEGER_NON_MINIMAL",
          "INTEGER has unnecessary leading 0xFF",
          context,
          node,
        );
      }
      return null;
    },
  },

  // BIT STRING validation
  {
    id: "bitstring-minimum-length",
    description: "BIT STRING must have at least 1 byte",
    profiles: ["der", "ber"],
    level: "basic",
    validate: (node, data, context) => {
      if (node.tagClass !== 0 || node.type !== 3) return null;

      const len = node.end - node.headerEnd;
      if (len < 1) {
        return createIssue(
          "BIT_STRING_EMPTY",
          "BIT STRING length must be at least 1",
          context,
          node,
        );
      }
      return null;
    },
  },

  {
    id: "BIT_STRING_INVALID_UNUSED",
    description: "BIT STRING unused bits must be 0-7",
    profiles: ["der", "ber"],
    level: "basic",
    validate: (node, data, context) => {
      if (node.tagClass !== 0 || node.type !== 3) return null;

      const len = node.end - node.headerEnd;
      if (len < 1) return null;

      const unused = data[node.headerEnd];
      if (unused > 7) {
        return createIssue(
          "BIT_STRING_INVALID_UNUSED",
          `BIT STRING unused bits must be 0-7, got ${unused}`,
          context,
          node,
        );
      }
      return null;
    },
  },

  {
    id: "BIT_STRING_EMPTY_WITH_UNUSED",
    description: "BIT STRING with length=1 must have unused=0",
    profiles: ["der", "ber"],
    level: "basic",
    validate: (node, data, context) => {
      if (node.tagClass !== 0 || node.type !== 3) return null;

      const len = node.end - node.headerEnd;
      if (len === 1) {
        const unused = data[node.headerEnd];
        if (unused !== 0) {
          return createIssue(
            "BIT_STRING_EMPTY_WITH_UNUSED",
            "BIT STRING with length=1 must have unused=0",
            context,
            node,
          );
        }
      }
      return null;
    },
  },

  {
    id: "BIT_STRING_TRAILING_BITS",
    description: "BIT STRING unused bits must be zero in last byte (DER)",
    profiles: ["der"],
    level: "strict",
    validate: (node, data, context) => {
      if (node.tagClass !== 0 || node.type !== 3) return null;

      const len = node.end - node.headerEnd;
      if (len <= 1) return null;

      const unused = data[node.headerEnd];
      const lastByte = data[node.end - 1];
      const mask = (1 << unused) - 1;

      if ((lastByte & mask) !== 0) {
        return createIssue(
          "BIT_STRING_TRAILING_BITS",
          "BIT STRING unused bits in last byte must be zero in DER mode",
          context,
          node,
        );
      }
      return null;
    },
  },

  // NULL validation
  {
    id: "null-length",
    description: "NULL must have length 0",
    profiles: ["der", "ber"],
    level: "basic",
    validate: (node, data, context) => {
      if (node.tagClass !== 0 || node.type !== 5) return null;

      const len = node.end - node.headerEnd;
      if (len !== 0) {
        return createIssue(
          "NULL_INVALID_LENGTH",
          `NULL length must be 0, got ${len}`,
          context,
          node,
        );
      }
      return null;
    },
  },

  // OBJECT IDENTIFIER validation
  {
    id: "oid-non-empty",
    description: "OBJECT IDENTIFIER must not be empty",
    profiles: ["der", "ber"],
    level: "basic",
    validate: (node, data, context) => {
      if (node.tagClass !== 0 || node.type !== 6) return null;

      const len = node.end - node.headerEnd;
      if (len === 0) {
        return createIssue(
          "OID_EMPTY",
          "OBJECT IDENTIFIER length must be greater than 0",
          context,
          node,
        );
      }
      return null;
    },
  },

  {
    id: "oid-first-subidentifiers",
    description: "OBJECT IDENTIFIER must have valid first two subidentifiers",
    profiles: ["der", "ber"],
    level: "strict",
    validate: (node, data, context) => {
      if (node.tagClass !== 0 || node.type !== 6) return null;

      const len = node.end - node.headerEnd;
      if (len < 1) return null;

      const firstByte = data[node.headerEnd];
      const first = Math.floor(firstByte / 40);
      const second = firstByte % 40;

      if (first > 2 || (first === 2 && second > 39)) {
        return createIssue(
          "OID_INVALID",
          `OBJECT IDENTIFIER first two components invalid: ${first}.${second}`,
          context,
          node,
        );
      }
      return null;
    },
  },

  {
    id: "oid-subidentifier-encoding",
    description: "OBJECT IDENTIFIER subidentifiers must be properly encoded",
    profiles: ["der", "ber"],
    level: "strict",
    validate: (node, data, context) => {
      if (node.tagClass !== 0 || node.type !== 6) return null;

      const len = node.end - node.headerEnd;
      if (len < 1) return null;

      let pos = node.headerEnd + 1;
      while (pos < node.end) {
        let value = 0;
        let hasMore = true;
        const startPos = pos;

        while (hasMore && pos < node.end) {
          const byte = data[pos++];
          value = (value << 7) | (byte & 0x7f);
          hasMore = (byte & 0x80) !== 0;

          if (value > 0xffffffff) {
            return createIssue(
              "OID_INVALID",
              "OBJECT IDENTIFIER subidentifier too large",
              context,
              node,
            );
          }
        }

        if (hasMore) {
          return createIssue(
            "OID_INCOMPLETE_SUBID",
            "OBJECT IDENTIFIER subidentifier incomplete",
            context,
            node,
          );
        }
      }
      return null;
    },
  },

  // ENUMERATED validation
  {
    id: "enumerated-non-empty",
    description: "ENUMERATED must not be empty",
    profiles: ["der", "ber"],
    level: "basic",
    validate: (node, data, context) => {
      if (node.tagClass !== 0 || node.type !== 10) return null;

      const len = node.end - node.headerEnd;
      if (len === 0) {
        return createIssue(
          "ENUMERATED_EMPTY",
          "ENUMERATED length must be greater than 0",
          context,
          node,
        );
      }
      return null;
    },
  },

  {
    id: "enumerated-der-minimal",
    description: "ENUMERATED must use minimal encoding in DER",
    profiles: ["der"],
    level: "strict",
    validate: (node, data, context) => {
      if (node.tagClass !== 0 || node.type !== 10) return null;

      const len = node.end - node.headerEnd;
      if (len <= 1) return null;

      const first = data[node.headerEnd];
      const second = data[node.headerEnd + 1];

      if (first === 0x00 && (second & 0x80) === 0) {
        return createIssue(
          "ENUMERATED_NON_MINIMAL",
          "ENUMERATED has unnecessary leading zero",
          context,
          node,
        );
      }
      if (first === 0xff && (second & 0x80) !== 0) {
        return createIssue(
          "ENUMERATED_NON_MINIMAL",
          "ENUMERATED has unnecessary leading 0xFF",
          context,
          node,
        );
      }
      return null;
    },
  },

  // PrintableString validation
  {
    id: "printablestring-charset",
    description: "PrintableString must contain only valid characters",
    profiles: ["der", "ber"],
    level: "strict",
    validate: (node, data, context) => {
      if (node.tagClass !== 0 || node.type !== 19) return null;

      for (let i = node.headerEnd; i < node.end; i++) {
        const byte = data[i];
        // Valid PrintableString characters: A-Z, a-z, 0-9, space, ', (, ), +, -, ., /, :, =, ?
        if (
          !(
            (byte >= 0x41 && byte <= 0x5a) || // A-Z
            (byte >= 0x61 && byte <= 0x7a) || // a-z
            (byte >= 0x30 && byte <= 0x39) || // 0-9
            byte === 0x20 || // space
            byte === 0x27 || // '
            byte === 0x28 || // (
            byte === 0x29 || // )
            byte === 0x2b || // +
            byte === 0x2c || // ,
            byte === 0x2d || // -
            byte === 0x2e || // .
            byte === 0x2f || // /
            byte === 0x3a || // :
            byte === 0x3d || // =
            byte === 0x3f // ?
          )
        ) {
          return createIssue(
            "PRINTABLE_INVALID_CHAR",
            `PrintableString contains invalid character 0x${byte.toString(16)}`,
            context,
            node,
          );
        }
      }
      return null;
    },
  },

  // IA5String validation
  {
    id: "ia5string-ascii",
    description: "IA5String must contain only ASCII characters",
    profiles: ["der", "ber"],
    level: "strict",
    validate: (node, data, context) => {
      if (node.tagClass !== 0 || node.type !== 22) return null;

      for (let i = node.headerEnd; i < node.end; i++) {
        const byte = data[i];
        if (byte > 0x7f) {
          return createIssue(
            "IA5_NON_ASCII",
            `IA5String contains non-ASCII character 0x${byte.toString(16)}`,
            context,
            node,
          );
        }
      }
      return null;
    },
  },

  // UTF8String validation
  {
    id: "utf8string-encoding",
    description: "UTF8String must be valid UTF-8",
    profiles: ["der", "ber"],
    level: "basic",
    validate: (node, data, context) => {
      if (node.tagClass !== 0 || node.type !== 12) return null;

      try {
        new TextDecoder("utf-8", { fatal: true }).decode(data.slice(node.headerEnd, node.end));
      } catch (e) {
        return createIssue(
          "UTF8_INVALID",
          "UTF8String contains invalid UTF-8 sequence",
          context,
          node,
        );
      }
      return null;
    },
  },

  // UTCTime validation
  {
    id: "utctime-length",
    description: "UTCTime must have valid length",
    profiles: ["der", "ber"],
    level: "basic",
    validate: (node, data, context) => {
      if (node.tagClass !== 0 || node.type !== 23) return null;

      const len = node.end - node.headerEnd;
      if (len < 11 || len > 17) {
        return createIssue(
          "utctime-length",
          `UTCTime length must be 11-17, got ${len}`,
          context,
          node,
        );
      }
      return null;
    },
  },

  {
    id: "utctime-format",
    description: "UTCTime must have valid format",
    profiles: ["der"],
    level: "strict",
    validate: (node, data, context) => {
      if (node.tagClass !== 0 || node.type !== 23) return null;

      const str = String.fromCharCode(...data.slice(node.headerEnd, node.end));
      // UTCTime must end with Z for UTC in DER
      if (!str.endsWith("Z") || !/^\d{10,12}Z$/.test(str)) {
        return createIssue(
          "UTCTIME_INVALID_FORMAT",
          `UTCTime format invalid: ${str}`,
          context,
          node,
        );
      }
      return null;
    },
  },

  // GeneralizedTime validation
  {
    id: "generalizedtime-length",
    description: "GeneralizedTime must have minimum length",
    profiles: ["der", "ber"],
    level: "basic",
    validate: (node, data, context) => {
      if (node.tagClass !== 0 || node.type !== 24) return null;

      const len = node.end - node.headerEnd;
      if (len < 14) {
        return createIssue(
          "generalizedtime-length",
          `GeneralizedTime length must be at least 14, got ${len}`,
          context,
          node,
        );
      }
      return null;
    },
  },

  {
    id: "generalizedtime-format",
    description: "GeneralizedTime must have valid format",
    profiles: ["der"],
    level: "strict",
    validate: (node, data, context) => {
      if (node.tagClass !== 0 || node.type !== 24) return null;

      const str = String.fromCharCode(...data.slice(node.headerEnd, node.end));
      // GeneralizedTime must end with Z for UTC in DER
      if (!str.endsWith("Z") || !/^\d{14}(\.\d+)?Z$/.test(str)) {
        return createIssue(
          "GENERALIZEDTIME_INVALID_FORMAT",
          `GeneralizedTime format invalid: ${str}`,
          context,
          node,
        );
      }
      return null;
    },
  },

  // BMPString validation
  {
    id: "bmpstring-even-length",
    description: "BMPString must have even length",
    profiles: ["der", "ber"],
    level: "basic",
    validate: (node, data, context) => {
      if (node.tagClass !== 0 || node.type !== 30) return null;

      const len = node.end - node.headerEnd;
      if (len % 2 !== 0) {
        return createIssue(
          "bmpstring-even-length",
          `BMPString length must be even, got ${len}`,
          context,
          node,
        );
      }
      return null;
    },
  },

  // DER encoding validation (for cases missed by parser)
  {
    id: "DER_INDEFINITE_LENGTH",
    description: "DER must not use indefinite length",
    profiles: ["der"],
    level: "strict",
    validate: (node, data, context) => {
      // Check if this node was parsed with indefinite length
      // This is detected by looking at the raw data to see if it has 0x80 length byte
      if (node.start >= data.length) return null;

      // Find the length byte position after the tag
      let pos = node.start;
      const firstByte = data[pos++];

      // Handle high tag numbers (tag byte has bit 5 set to 1 for tag >= 31)
      if ((firstByte & 0x1f) === 0x1f) {
        // Skip additional tag bytes
        while (pos < data.length && (data[pos] & 0x80) !== 0) {
          pos++;
        }
        if (pos < data.length) pos++; // skip final tag byte
      }

      if (pos >= data.length) return null;

      const lengthByte = data[pos];
      if (lengthByte === 0x80) {
        return createIssue(
          "DER_INDEFINITE_LENGTH",
          "DER encoding must not use indefinite length",
          context,
          node,
        );
      }
      return null;
    },
  },

  {
    id: "DER_NON_MINIMAL_LENGTH",
    description: "DER must use minimal length encoding",
    profiles: ["der"],
    level: "strict",
    validate: (node, data, context) => {
      // Check if length encoding is minimal
      if (node.start >= data.length) return null;

      // Find the length byte position after the tag
      let pos = node.start;
      const firstByte = data[pos++];

      // Handle high tag numbers
      if ((firstByte & 0x1f) === 0x1f) {
        while (pos < data.length && (data[pos] & 0x80) !== 0) {
          pos++;
        }
        if (pos < data.length) pos++;
      }

      if (pos >= data.length) return null;

      const lengthByte = data[pos];

      // If it's long form length (bit 7 set and not indefinite)
      if ((lengthByte & 0x80) !== 0 && lengthByte !== 0x80) {
        const numLengthBytes = lengthByte & 0x7f;

        if (numLengthBytes === 0) return null;
        if (pos + numLengthBytes >= data.length) return null;

        // Check if length could have been encoded in short form
        let length = 0;
        for (let i = 0; i < numLengthBytes; i++) {
          length = (length << 8) + data[pos + 1 + i];
        }

        // If length < 128, it should use short form
        if (length < 128) {
          return createIssue(
            "DER_NON_MINIMAL_LENGTH",
            `DER length ${length} should use short form, not long form`,
            context,
            node,
          );
        }

        // Check for leading zero bytes in long form length
        if (numLengthBytes > 1 && data[pos + 1] === 0) {
          return createIssue(
            "DER_NON_MINIMAL_LENGTH",
            "DER long form length must not have leading zero bytes",
            context,
            node,
          );
        }
      }
      return null;
    },
  },

  // REAL validation
  {
    id: "real-non-empty",
    description: "REAL must not be empty",
    profiles: ["der", "ber"],
    level: "basic",
    validate: (node, data, context) => {
      if (node.tagClass !== 0 || node.type !== 9) return null;

      const len = node.end - node.headerEnd;
      if (len === 0) {
        return createIssue("REAL_EMPTY", "REAL length must be greater than 0", context, node);
      }
      return null;
    },
  },

  // RELATIVE OBJECT IDENTIFIER validation
  {
    id: "relative-oid-non-empty",
    description: "RELATIVE OBJECT IDENTIFIER must not be empty",
    profiles: ["der", "ber"],
    level: "basic",
    validate: (node, data, context) => {
      if (node.tagClass !== 0 || node.type !== 13) return null;

      const len = node.end - node.headerEnd;
      if (len === 0) {
        return createIssue(
          "RELATIVE_OID_EMPTY",
          "RELATIVE OBJECT IDENTIFIER length must be greater than 0",
          context,
          node,
        );
      }
      return null;
    },
  },

  {
    id: "relative-oid-subidentifier-encoding",
    description: "RELATIVE OBJECT IDENTIFIER subidentifiers must be properly encoded",
    profiles: ["der", "ber"],
    level: "strict",
    validate: (node, data, context) => {
      if (node.tagClass !== 0 || node.type !== 13) return null;

      const len = node.end - node.headerEnd;
      if (len < 1) return null;

      let pos = node.headerEnd;
      while (pos < node.end) {
        let value = 0;
        let hasMore = true;
        const startPos = pos;

        while (hasMore && pos < node.end) {
          const byte = data[pos++];
          value = (value << 7) | (byte & 0x7f);
          hasMore = (byte & 0x80) !== 0;

          if (value > 0xffffffff) {
            return createIssue(
              "RELATIVE_OID_INVALID",
              "RELATIVE OBJECT IDENTIFIER subidentifier too large",
              context,
              node,
            );
          }
        }

        if (hasMore) {
          return createIssue(
            "RELATIVE_OID_INCOMPLETE_SUBID",
            "RELATIVE OBJECT IDENTIFIER subidentifier incomplete",
            context,
            node,
          );
        }
      }
      return null;
    },
  },

  // NumericString validation
  {
    id: "numericstring-charset",
    description: "NumericString must contain only digits and spaces",
    profiles: ["der", "ber"],
    level: "strict",
    validate: (node, data, context) => {
      if (node.tagClass !== 0 || node.type !== 18) return null;

      for (let i = node.headerEnd; i < node.end; i++) {
        const byte = data[i];
        // NumericString: digits (0x30-0x39) and space (0x20) only
        if (!((byte >= 0x30 && byte <= 0x39) || byte === 0x20)) {
          return createIssue(
            "NUMERICSTRING_INVALID_CHAR",
            `NumericString contains invalid character 0x${byte.toString(16)}`,
            context,
            node,
          );
        }
      }
      return null;
    },
  },

  // TeletexString validation
  {
    id: "teletexstring-no-null",
    description: "TeletexString must not contain null bytes",
    profiles: ["der", "ber"],
    level: "basic",
    validate: (node, data, context) => {
      if (node.tagClass !== 0 || node.type !== 20) return null;

      for (let i = node.headerEnd; i < node.end; i++) {
        const byte = data[i];
        if (byte === 0x00) {
          return createIssue(
            "TELETEXSTRING_NULL_BYTE",
            "TeletexString contains null byte",
            context,
            node,
          );
        }
      }
      return null;
    },
  },

  // VisibleString validation
  {
    id: "visiblestring-charset",
    description: "VisibleString must contain only visible characters",
    profiles: ["der", "ber"],
    level: "strict",
    validate: (node, data, context) => {
      if (node.tagClass !== 0 || node.type !== 26) return null;

      for (let i = node.headerEnd; i < node.end; i++) {
        const byte = data[i];
        // VisibleString: 0x20-0x7E (space through tilde)
        if (!(byte >= 0x20 && byte <= 0x7e)) {
          return createIssue(
            "VISIBLESTRING_INVALID_CHAR",
            `VisibleString contains invalid character 0x${byte.toString(16)}`,
            context,
            node,
          );
        }
      }
      return null;
    },
  },

  // GeneralString validation
  {
    id: "generalstring-non-empty",
    description: "GeneralString must not be empty",
    profiles: ["der", "ber"],
    level: "basic",
    validate: (node, data, context) => {
      if (node.tagClass !== 0 || node.type !== 27) return null;

      const len = node.end - node.headerEnd;
      if (len === 0) {
        return createIssue("GENERALSTRING_EMPTY", "GeneralString cannot be empty", context, node);
      }
      return null;
    },
  },

  // UniversalString validation
  {
    id: "universalstring-length",
    description: "UniversalString length must be multiple of 4",
    profiles: ["der", "ber"],
    level: "basic",
    validate: (node, data, context) => {
      if (node.tagClass !== 0 || node.type !== 28) return null;

      const len = node.end - node.headerEnd;
      if (len % 4 !== 0) {
        return createIssue(
          "UNIVERSALSTRING_INVALID_LENGTH",
          `UniversalString length must be multiple of 4, got ${len}`,
          context,
          node,
        );
      }
      return null;
    },
  },

  {
    id: "universalstring-unicode",
    description: "UniversalString must contain valid Unicode code points",
    profiles: ["der", "ber"],
    level: "strict",
    validate: (node, data, context) => {
      if (node.tagClass !== 0 || node.type !== 28) return null;

      const len = node.end - node.headerEnd;
      if (len % 4 !== 0) return null;

      // Check for valid Unicode code points
      for (let i = node.headerEnd; i < node.end; i += 4) {
        const codePoint = (data[i] << 24) | (data[i + 1] << 16) | (data[i + 2] << 8) | data[i + 3];
        if (codePoint > 0x10ffff) {
          return createIssue(
            "UNIVERSALSTRING_INVALID_CODEPOINT",
            `UniversalString contains invalid Unicode code point 0x${codePoint.toString(16)}`,
            context,
            node,
          );
        }
        // Check for surrogate code points (0xD800-0xDFFF)
        if (codePoint >= 0xd800 && codePoint <= 0xdfff) {
          return createIssue(
            "UNIVERSALSTRING_SURROGATE",
            `UniversalString contains surrogate code point 0x${codePoint.toString(16)}`,
            context,
            node,
          );
        }
      }
      return null;
    },
  },

  // CharacterString validation
  {
    id: "characterstring-non-empty",
    description: "CharacterString must not be empty",
    profiles: ["der", "ber"],
    level: "basic",
    validate: (node, data, context) => {
      if (node.tagClass !== 0 || node.type !== 29) return null;

      const len = node.end - node.headerEnd;
      if (len === 0) {
        return createIssue(
          "CHARACTERSTRING_EMPTY",
          "CharacterString cannot be empty",
          context,
          node,
        );
      }
      return null;
    },
  },

  // X.509 specific validation
  {
    id: "x509-utctime-y2050",
    description: "X.509 UTCTime must handle year 2050 correctly",
    profiles: ["x509"],
    level: "strict",
    validate: (node, data, context) => {
      if (node.tagClass !== 0 || node.type !== 23) return null; // not UTCTime

      const len = node.end - node.headerEnd;
      if (len < 2) return null;

      const str = new TextDecoder().decode(data.slice(node.headerEnd, node.end));
      const year = parseInt(str.substring(0, 2), 10);

      // Years 50-99 represent 1950-1999, 00-49 represent 2000-2049
      // Year 50+ should be flagged for X.509
      if (year >= 50) {
        return createIssue(
          "X509_UTCTIME_YEAR_2050",
          "X.509 UTCTime year >= 50 may be ambiguous (use GeneralizedTime for years >= 2050)",
          context,
          node,
        );
      }
      return null;
    },
  },
];

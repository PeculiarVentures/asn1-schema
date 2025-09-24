import {
  AsnNode,
  AsnNodeUtils,
  AsnParser,
  AsnSerializer,
  CompiledSchema,
  AsnDecoders,
  ParseContext,
} from "@peculiar/asn1-codec";
import { AnyConverterType, IAsnConverter, IntegerConverterType } from "./types";
import { AsnPropTypes } from "./enums";
import { OctetString } from "./types/index";

/**
 * NOTE: Converter MUST have name Asn<Asn1PropType.name>Converter.
 * Asn1Prop decorator link custom converters by name of the Asn1PropType
 */

/**
 * ASN.1 ANY converter
 */
export const AsnAnyConverter: IAsnConverter<AnyConverterType> = {
  fromASN: (value: AsnNode) => {
    if (value.tagClass === 0 && value.type === 5) {
      return null;
    }
    const ctx = AsnNodeUtils.getContext(value);
    const bytes = ctx.sliceRaw(value);
    return bytes.buffer.slice(bytes.byteOffset, bytes.byteOffset + bytes.byteLength);
  },
  toASN: (value: AnyConverterType): AsnNode => {
    let node = AsnNodeUtils.makeNode();
    if (value === null) {
      node.type = 5;
      node.valueRaw = new Uint8Array(0);
    } else if (value instanceof ArrayBuffer) {
      const data = new Uint8Array(value);

      // Try to parse as DER
      try {
        const res = AsnParser.parse(data, { captureRaw: true });
        if (!res.errors || res.errors.length === 0) {
          // It's valid DER, use it as is
          node = res.root;
        } else {
          // Not valid DER, throw error as legacy behavior expects
          throw new Error(`Invalid ANY value: ${res.errors[0]?.message || "parse error"}`);
        }
      } catch {
        // Re-throw to match expected behavior for wrong encoded values
        throw new Error("Invalid ANY value");
      }
    } else {
      const res = AsnParser.parse(new Uint8Array(value), { captureRaw: true });
      if (res.errors?.length) {
        throw new Error(`Error parse ANY value: ${res.errors[0].message}`);
      }
      node = res.root;
    }

    return node;
  },
};

const integerSchema: CompiledSchema = {
  root: {
    id: -1,
    name: "IntegerWrapper",
    typeName: "INTEGER",
    expectedTag: { cls: 0, tag: 2, constructed: false },
  },
  nodes: new Map(),
};

/**
 * ASN.1 INTEGER to Number/String converter
 */
export const AsnIntegerConverter: IAsnConverter<IntegerConverterType> = {
  fromASN: (value: AsnNode) => {
    const decoded = AsnDecoders.decodeInteger(value) as number | bigint;
    // Convert bigint to string for large numbers
    if (typeof decoded === "bigint") {
      return decoded.toString();
    }
    return decoded as number | string;
  },
  toASN: (value: IntegerConverterType) => {
    // Convert string to BigInt for proper INTEGER encoding
    let numericValue: number | bigint;
    if (typeof value === "string") {
      // Try to parse as number first
      const parsed = Number(value);
      if (Number.isInteger(parsed) && parsed.toString() === value) {
        numericValue = parsed;
      } else {
        // Use BigInt for large numbers
        numericValue = BigInt(value);
      }
    } else {
      numericValue = value;
    }
    return AsnSerializer.serialize(numericValue, integerSchema);
  },
};

const enumeratedSchema: CompiledSchema = {
  root: {
    id: -1,
    name: "EnumeratedWrapper",
    typeName: "ENUMERATED",
    expectedTag: { cls: 0, tag: 10, constructed: false },
  },
  nodes: new Map(),
};

/**
 * ASN.1 ENUMERATED converter
 */
export const AsnEnumeratedConverter: IAsnConverter<number> = {
  fromASN: (value: AsnNode) => AsnDecoders.decodeEnumerated(value) as number,
  toASN: (value: number) => AsnSerializer.serialize(value, enumeratedSchema),
};

/**
 * ASN.1 INTEGER to ArrayBuffer converter
 */
export const AsnIntegerArrayBufferConverter: IAsnConverter<ArrayBuffer> = {
  fromASN: (value: AsnNode) => {
    // Return raw bytes of the integer value without INTEGER header/length.
    // Slice the encoded value content (valueRaw) directly.
    // If constructed/primitive differences exist, context.sliceValueRaw handles it.
    const ctx = AsnNodeUtils.getContext(value);
    const bytes = ctx.sliceValueRaw(value);
    return bytes.buffer.slice(bytes.byteOffset, bytes.byteOffset + bytes.byteLength);
  },
  toASN: (value: ArrayBuffer) => {
    // Wrap provided bytes as INTEGER content without changing sign/adding a leading 0x00.
    const node = AsnNodeUtils.makeNode();
    node.tagClass = 0; // UNIVERSAL
    node.type = 2; // INTEGER
    node.constructed = false;
    node.valueRaw = new Uint8Array(value);
    node.end = node.valueRaw.length;
    return node;
  },
};

/**
 * ASN.1 INTEGER to BigInt converter
 */
export const AsnIntegerBigIntConverter: IAsnConverter<bigint> = {
  fromASN: (value: AsnNode) => {
    const v = AsnDecoders.decodeInteger(value) as number | bigint;
    return typeof v === "bigint" ? v : BigInt(v);
  },
  toASN: (value: bigint) => AsnSerializer.serialize(value, integerSchema),
};

// Removed unused bitStringSchema; BIT STRING converter constructs node manually

/**
 * ASN.1 BIT STRING converter
 */
export const AsnBitStringConverter: IAsnConverter<ArrayBuffer> = {
  fromASN: (value: AsnNode) => {
    const bitString = AsnDecoders.decodeBitString(value) as {
      unusedBits: number;
      bytes: Uint8Array;
    };
    // Return raw bytes only as ArrayBuffer (legacy API expects ArrayBuffer)
    const bytes = bitString.bytes;
    return bytes.buffer.slice(bytes.byteOffset, bytes.byteOffset + bytes.byteLength);
  },
  toASN: (value: ArrayBuffer) => {
    // Accept raw bytes only; encode with 0 unused bits by default
    const bytes = new Uint8Array(value);
    const unusedBits = 0;
    // Build AsnNode manually to inject unusedBits prefix
    const node = AsnNodeUtils.makeNode();
    node.tagClass = 0; // UNIVERSAL
    node.type = 3; // BIT STRING
    node.constructed = false;
    const content = new Uint8Array(bytes.length + 1);
    content[0] = unusedBits & 0x07;
    content.set(bytes, 1);
    node.valueRaw = content;
    node.end = content.length;
    return node;
  },
};

const objectIdentifierSchema: CompiledSchema = {
  root: {
    id: -1,
    name: "ObjectIdentifierWrapper",
    typeName: "OBJECT IDENTIFIER",
    expectedTag: { cls: 0, tag: 6, constructed: false },
  },
  nodes: new Map(),
};

/**
 * ASN.1 OBJECT IDENTIFIER converter
 */
export const AsnObjectIdentifierConverter: IAsnConverter<string> = {
  fromASN: (value: AsnNode) => AsnDecoders.decodeObjectIdentifier(value) as string,
  toASN: (value: string) => AsnSerializer.serialize(value, objectIdentifierSchema),
};

const booleanSchema: CompiledSchema = {
  root: {
    id: -1,
    name: "BooleanWrapper",
    typeName: "BOOLEAN",
    expectedTag: { cls: 0, tag: 1, constructed: false },
  },
  nodes: new Map(),
};

/**
 * ASN.1 BOOLEAN converter
 */
export const AsnBooleanConverter: IAsnConverter<boolean> = {
  fromASN: (value: AsnNode) => AsnDecoders.decodeBoolean(value) as boolean,
  toASN: (value: boolean) => AsnSerializer.serialize(value, booleanSchema),
};

const octetStringSchema: CompiledSchema = {
  root: {
    id: -1,
    name: "OctetStringWrapper",
    typeName: "OCTET STRING",
    expectedTag: { cls: 0, tag: 4, constructed: false },
  },
  nodes: new Map(),
};

/**
 * ASN.1 OCTET_STRING converter
 */
export const AsnOctetStringConverter: IAsnConverter<ArrayBuffer> = {
  fromASN: (value: AsnNode) => {
    const bytes = AsnDecoders.decodeOctetString(value) as Uint8Array;
    return bytes.buffer.slice(bytes.byteOffset, bytes.byteOffset + bytes.byteLength);
  },
  toASN: (value: ArrayBuffer) => AsnSerializer.serialize(value, octetStringSchema),
};

/**
 * ASN.1 OCTET_STRING converter to OctetString class
 */
export const AsnConstructedOctetStringConverter: IAsnConverter<OctetString> = {
  fromASN: (value: AsnNode) => {
    // Support receiving a plain AsnNode without context as well
    if ((value as unknown as { context?: ParseContext }).context) {
      const bytes = AsnDecoders.decodeOctetString(value) as Uint8Array;
      const buffer = bytes.buffer.slice(bytes.byteOffset, bytes.byteOffset + bytes.byteLength);
      return new OctetString(buffer);
    }
    const node = value as unknown as AsnNode;
    const raw = node.valueRaw || new Uint8Array(0);
    const buffer = raw.buffer.slice(raw.byteOffset, raw.byteOffset + raw.byteLength);
    return new OctetString(buffer);
  },
  toASN: (value: OctetString) => AsnSerializer.serialize(value.buffer, octetStringSchema),
};

function createStringConverter(
  schema: CompiledSchema,
  decoder: (node: AsnNode) => unknown = AsnDecoders.decodeUtf8String,
): IAsnConverter<string> {
  return {
    fromASN: (value: AsnNode) => decoder(value) as string,
    toASN: (value: string) => AsnSerializer.serialize(value, schema),
  };
}

function createSchema(name: string, type: string, tag: number): CompiledSchema {
  return {
    root: {
      id: -1,
      name,
      typeName: type,
      expectedTag: { cls: 0, tag, constructed: false },
    },
    nodes: new Map(),
  };
}

const utf8StringSchema = createSchema("Utf8StringWrapper", "UTF8 STRING", 12);

/**
 * ASN.1 UTF8_STRING converter
 */
export const AsnUtf8StringConverter = createStringConverter(utf8StringSchema);

const bmpStringSchema = createSchema("BmpStringWrapper", "BMP STRING", 30);

/**
 * ASN.1 BMP STRING converter
 */
export const AsnBmpStringConverter = createStringConverter(
  bmpStringSchema,
  AsnDecoders.decodeBmpString,
);

const universalStringSchema = createSchema("UniversalStringWrapper", "UNIVERSAL STRING", 28);

/**
 * ASN.1 UNIVERSAL STRING converter
 */
export const AsnUniversalStringConverter = createStringConverter(
  universalStringSchema,
  AsnDecoders.decodeUniversalString,
);

const numericStringSchema = createSchema("NumericStringWrapper", "NUMERIC STRING", 18);

/**
 * ASN.1 NUMERIC STRING converter
 */
export const AsnNumericStringConverter = createStringConverter(
  numericStringSchema,
  AsnDecoders.decodeNumericString,
);

const printableStringSchema = createSchema("PrintableStringWrapper", "PRINTABLE STRING", 19);

/**
 * ASN.1 PRINTABLE STRING converter
 */
export const AsnPrintableStringConverter = createStringConverter(
  printableStringSchema,
  AsnDecoders.decodePrintableString,
);

const teletexStringSchema = createSchema("TeletexStringWrapper", "TELETEX STRING", 20);

/**
 * ASN.1 TELETEX STRING converter
 */
export const AsnTeletexStringConverter = createStringConverter(
  teletexStringSchema,
  AsnDecoders.decodeTeletexString,
);

const videotexStringSchema = createSchema("VideotexStringWrapper", "VIDEOTEX STRING", 21);

/**
 * ASN.1 VIDEOTEX STRING converter
 */
export const AsnVideotexStringConverter = createStringConverter(
  videotexStringSchema,
  AsnDecoders.decodeVideotexString,
);

const ia5StringSchema = createSchema("IA5StringWrapper", "IA5 STRING", 22);

/**
 * ASN.1 IA5 STRING converter
 */
export const AsnIA5StringConverter = createStringConverter(
  ia5StringSchema,
  AsnDecoders.decodeIa5String,
);

const graphicStringSchema = createSchema("GraphicStringWrapper", "GRAPHIC STRING", 25);

/**
 * ASN.1 GRAPHIC STRING converter
 */
export const AsnGraphicStringConverter = createStringConverter(
  graphicStringSchema,
  AsnDecoders.decodeGraphicString,
);

const visibleStringSchema = createSchema("VisibleStringWrapper", "VISIBLE STRING", 26);

/**
 * ASN.1 VISIBLE STRING converter
 */
export const AsnVisibleStringConverter = createStringConverter(
  visibleStringSchema,
  AsnDecoders.decodeVisibleString,
);

const generalStringSchema = createSchema("GeneralStringWrapper", "GENERAL STRING", 27);

/**
 * ASN.1 GENERAL STRING converter
 */
export const AsnGeneralStringConverter = createStringConverter(
  generalStringSchema,
  AsnDecoders.decodeGeneralString,
);

const characterStringSchema = createSchema("CharacterStringWrapper", "CHARACTER STRING", 29);

/**
 * ASN.1 CHARACTER STRING converter
 */
export const AsnCharacterStringConverter = createStringConverter(
  characterStringSchema,
  AsnDecoders.decodeCharacterString,
);

const utcTimeSchema = createSchema("UTCTimeWrapper", "UTCTIME", 23);

/**
 * ASN.1 UTCTime converter
 */
export const AsnUTCTimeConverter: IAsnConverter<Date> = {
  fromASN: (value: AsnNode) => AsnDecoders.decodeUtcTime(value) as Date,
  toASN: (value: Date) => AsnSerializer.serialize(value, utcTimeSchema),
};

const generalizedTimeSchema = createSchema("GeneralizedTimeWrapper", "GENERALIZED TIME", 24);

/**
 * ASN.1 GeneralizedTime converter
 */
export const AsnGeneralizedTimeConverter: IAsnConverter<Date> = {
  fromASN: (value: AsnNode) => AsnDecoders.decodeGeneralizedTime(value) as Date,
  toASN: (value: Date) => AsnSerializer.serialize(value, generalizedTimeSchema),
};

const nullSchema = createSchema("NullWrapper", "NULL", 5);
const nullValueRaw = new Uint8Array(0);
/**
 * ASN.1 ANY converter
 */
export const AsnNullConverter: IAsnConverter<null> = {
  fromASN: () => null,
  toASN: () => {
    const node = AsnSerializer.serialize(null, nullSchema);
    node.valueRaw = nullValueRaw;
    return node;
  },
};

/**
 * Returns default converter for specified type
 * @param type
 */
export function defaultConverter(type: AsnPropTypes): IAsnConverter | null {
  switch (type) {
    case AsnPropTypes.Any:
      return AsnAnyConverter;
    case AsnPropTypes.BitString:
      return AsnBitStringConverter;
    case AsnPropTypes.BmpString:
      return AsnBmpStringConverter;
    case AsnPropTypes.Boolean:
      return AsnBooleanConverter;
    case AsnPropTypes.CharacterString:
      return AsnCharacterStringConverter;
    case AsnPropTypes.Enumerated:
      return AsnEnumeratedConverter;
    case AsnPropTypes.GeneralString:
      return AsnGeneralStringConverter;
    case AsnPropTypes.GeneralizedTime:
      return AsnGeneralizedTimeConverter;
    case AsnPropTypes.GraphicString:
      return AsnGraphicStringConverter;
    case AsnPropTypes.IA5String:
      return AsnIA5StringConverter;
    case AsnPropTypes.Integer:
      return AsnIntegerConverter;
    case AsnPropTypes.Null:
      return AsnNullConverter;
    case AsnPropTypes.NumericString:
      return AsnNumericStringConverter;
    case AsnPropTypes.ObjectIdentifier:
      return AsnObjectIdentifierConverter;
    case AsnPropTypes.OctetString:
      return AsnOctetStringConverter;
    case AsnPropTypes.PrintableString:
      return AsnPrintableStringConverter;
    case AsnPropTypes.TeletexString:
      return AsnTeletexStringConverter;
    case AsnPropTypes.UTCTime:
      return AsnUTCTimeConverter;
    case AsnPropTypes.UniversalString:
      return AsnUniversalStringConverter;
    case AsnPropTypes.Utf8String:
      return AsnUtf8StringConverter;
    case AsnPropTypes.VideotexString:
      return AsnVideotexStringConverter;
    case AsnPropTypes.VisibleString:
      return AsnVisibleStringConverter;
    default:
      return null;
  }
}

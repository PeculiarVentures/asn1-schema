import * as asn1js from "asn1js";
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
  fromASN: (value: asn1js.AsnType) => value instanceof asn1js.Null ? null : value.valueBeforeDecodeView,
  toASN: (value: AnyConverterType): asn1js.AsnType => {
    if (value === null) {
      return new asn1js.Null();
    }
    const schema = asn1js.fromBER(value);
    if (schema.result.error) {
      throw new Error(schema.result.error);
    }
    return schema.result;
  },
};

/**
 * ASN.1 INTEGER to Number/String converter
 */
export const AsnIntegerConverter: IAsnConverter<IntegerConverterType, asn1js.Integer> = {
  fromASN: (value: asn1js.Integer) => value.valueBlock.valueHexView.byteLength >= 4
    ? value.valueBlock.toString() // use string format
    : value.valueBlock.valueDec, // use number format
  toASN: (value: IntegerConverterType) => new asn1js.Integer({ value: +value }),
};

/**
 * ASN.1 ENUMERATED converter
 */
export const AsnEnumeratedConverter: IAsnConverter<number, asn1js.Enumerated> = {
  fromASN: (value: asn1js.Enumerated) => value.valueBlock.valueDec,
  toASN: (value: number) => new asn1js.Enumerated({ value }),
};

/**
 * ASN.1 INTEGER to ArrayBuffer converter
 */
export const AsnIntegerArrayBufferConverter: IAsnConverter<ArrayBuffer, asn1js.Integer> = {
  fromASN: (value: asn1js.Integer) => value.valueBlock.valueHexView,
  toASN: (value: ArrayBuffer) => new asn1js.Integer({ valueHex: value }),
};

/**
 * ASN.1 INTEGER to BigInt converter
 */
export const AsnIntegerBigIntConverter: IAsnConverter<bigint, asn1js.Integer> = {
  fromASN: (value: asn1js.Integer) => value.toBigInt(),
  toASN: (value: bigint) => asn1js.Integer.fromBigInt(value),
};

/**
 * ASN.1 BIT STRING converter
 */
export const AsnBitStringConverter: IAsnConverter<ArrayBuffer, asn1js.BitString> = {
  fromASN: (value: asn1js.BitString) => value.valueBlock.valueHexView,
  toASN: (value: ArrayBuffer) => new asn1js.BitString({ valueHex: value }),
};

/**
 * ASN.1 OBJECT IDENTIFIER converter
 */
export const AsnObjectIdentifierConverter: IAsnConverter<string, asn1js.ObjectIdentifier> = {
  fromASN: (value: asn1js.ObjectIdentifier) => value.valueBlock.toString(),
  toASN: (value: string) => new asn1js.ObjectIdentifier({ value }),
};

/**
 * ASN.1 BOOLEAN converter
 */
export const AsnBooleanConverter: IAsnConverter<boolean, asn1js.Boolean> = {
  fromASN: (value: asn1js.Boolean) => value.valueBlock.value,
  toASN: (value: boolean) => new asn1js.Boolean({ value }),
};

/**
 * ASN.1 OCTET_STRING converter
 */
export const AsnOctetStringConverter: IAsnConverter<ArrayBuffer, asn1js.OctetString> = {
  fromASN: (value: asn1js.OctetString) => value.valueBlock.valueHexView,
  toASN: (value: ArrayBuffer) => new asn1js.OctetString({ valueHex: value }),
};

/**
 * ASN.1 OCTET_STRING converter to OctetString class
 */
export const AsnConstructedOctetStringConverter: IAsnConverter<OctetString, asn1js.OctetString> = {
  fromASN: (value: asn1js.OctetString) => new OctetString(value.getValue()),
  toASN: (value: OctetString) => value.toASN(),
};

function createStringConverter<T extends asn1js.BaseStringBlock>(Asn1Type: new (params: { value: string; }) => T): IAsnConverter<string> {
  return {
    fromASN: (value: T) => value.valueBlock.value,
    toASN: (value: string) => new Asn1Type({ value }),
  };
}

/**
 * ASN.1 UTF8_STRING converter
 */
export const AsnUtf8StringConverter = createStringConverter(asn1js.Utf8String);
/**
 * ASN.1 BPM STRING converter
 */
export const AsnBmpStringConverter = createStringConverter(asn1js.BmpString);
/**
 * ASN.1 UNIVERSAL STRING converter
 */
export const AsnUniversalStringConverter = createStringConverter(asn1js.UniversalString);
/**
 * ASN.1 NUMERIC STRING converter
 */
export const AsnNumericStringConverter = createStringConverter(asn1js.NumericString);
/**
 * ASN.1 PRINTABLE STRING converter
 */
export const AsnPrintableStringConverter = createStringConverter(asn1js.PrintableString);
/**
 * ASN.1 TELETEX STRING converter
 */
export const AsnTeletexStringConverter = createStringConverter(asn1js.TeletexString);
/**
 * ASN.1 VIDEOTEX STRING converter
 */
export const AsnVideotexStringConverter = createStringConverter(asn1js.VideotexString);
/**
 * ASN.1 IA5 STRING converter
 */
export const AsnIA5StringConverter = createStringConverter(asn1js.IA5String);
/**
 * ASN.1 GRAPHIC STRING converter
 */
export const AsnGraphicStringConverter = createStringConverter(asn1js.GraphicString);
/**
 * ASN.1 VISIBLE STRING converter
 */
export const AsnVisibleStringConverter = createStringConverter(asn1js.VisibleString);
/**
 * ASN.1 GENERAL STRING converter
 */
export const AsnGeneralStringConverter = createStringConverter(asn1js.GeneralString);
/**
 * ASN.1 CHARACTER STRING converter
 */
export const AsnCharacterStringConverter = createStringConverter(asn1js.CharacterString);

/**
 * ASN.1 UTCTime converter
 */
export const AsnUTCTimeConverter: IAsnConverter<Date, asn1js.UTCTime> = {
  fromASN: (value: asn1js.UTCTime) => value.toDate(),
  toASN: (value: Date) => new asn1js.UTCTime({ valueDate: value }),
};
/**
 * ASN.1 GeneralizedTime converter
 */
export const AsnGeneralizedTimeConverter: IAsnConverter<Date, asn1js.GeneralizedTime> = {
  fromASN: (value: asn1js.GeneralizedTime) => value.toDate(),
  toASN: (value: Date) => new asn1js.GeneralizedTime({ valueDate: value }),
};

/**
 * ASN.1 ANY converter
 */
export const AsnNullConverter: IAsnConverter<null, asn1js.Null> = {
  fromASN: () => null,
  toASN: () => {
    return new asn1js.Null();
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
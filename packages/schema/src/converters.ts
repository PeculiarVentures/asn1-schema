// @ts-ignore
import * as asn1 from "asn1js";
import { AnyConverterType, IAsnConverter, IntegerConverterType } from "./types";
/**
 * NOTE: Converter MUST have name Asn<Asn1PropType.name>Converter.
 * Asn1Prop decorator link custom converters by name of the Asn1PropType
 */

/**
 * ASN.1 ANY converter
 */
export const AsnAnyConverter: IAsnConverter<AnyConverterType> = {
  fromASN: (value: any) => value instanceof asn1.Null ? null : value.valueBeforeDecode,
  toASN: (value: AnyConverterType) => {
    if (value === null) {
      return new asn1.Null();
    }
    const schema = asn1.fromBER(value);
    if (schema.result.error) {
      throw new Error(schema.result.error);
    }
    return schema.result;
  },
};

/**
 * ASN.1 INTEGER to Number/String converter
 */
export const AsnIntegerConverter: IAsnConverter<IntegerConverterType> = {
  fromASN: (value: any) => !value.valueBlock.valueDec && value.valueBlock.valueHex.byteLength > 0 ?
    value.valueBlock.toString() // Convert number to string
    : value.valueBlock.valueDec, // use number format
  toASN: (value: IntegerConverterType) => new asn1.Integer({ value: value as any }),
};

/**
 * ASN.1 ENUMERATED converter
 */
export const AsnEnumeratedConverter: IAsnConverter<number> = {
  fromASN: (value: any) => value.valueBlock.valueDec,
  toASN: (value: number) => new asn1.Enumerated({ value }),
};

/**
 * ASN.1 INTEGER to ArrayBuffer converter
 */
export const AsnIntegerArrayBufferConverter: IAsnConverter<ArrayBuffer> = {
  fromASN: (value: any) => value.valueBlock.valueHex,
  toASN: (value: ArrayBuffer) => new asn1.Integer({ valueHex: value } as any),
};

/**
 * ASN.1 BIT STRING converter
 */
export const AsnBitStringConverter: IAsnConverter<ArrayBuffer> = {
  fromASN: (value: any) => value.valueBlock.valueHex,
  toASN: (value: ArrayBuffer) => new asn1.BitString({ valueHex: value }),
};

/**
 * ASN.1 OBJECT IDENTIFIER converter
 */
export const AsnObjectIdentifierConverter: IAsnConverter<string> = {
  fromASN: (value: any) => value.valueBlock.toString(),
  toASN: (value: string) => new asn1.ObjectIdentifier({ value }),
};

/**
 * ASN.1 BOOLEAN converter
 */
export const AsnBooleanConverter: IAsnConverter<boolean> = {
  fromASN: (value: any) => value.valueBlock.value,
  toASN: (value: boolean) => new asn1.Boolean({ value } as any),
};

/**
 * ASN.1 OCTET_STRING converter
 */
export const AsnOctetStringConverter: IAsnConverter<ArrayBuffer> = {
  fromASN: (value: any) => value.valueBlock.valueHex,
  toASN: (value: ArrayBuffer) => new asn1.OctetString({ valueHex: value }),
};

function createStringConverter(Asn1Type: any): IAsnConverter<string> {
  return {
    fromASN: (value: any) => value.valueBlock.value,
    toASN: (value: string) => new Asn1Type({ value }),
  };
}

/**
 * ASN.1 UTF8_STRING converter
 */
export const AsnUtf8StringConverter = createStringConverter(asn1.Utf8String);
/**
 * ASN.1 BPM STRING converter
 */
export const AsnBmpStringConverter = createStringConverter(asn1.BmpString);
/**
 * ASN.1 UNIVERSAL STRING converter
 */
export const AsnUniversalStringConverter = createStringConverter(asn1.UniversalString);
/**
 * ASN.1 NUMERIC STRING converter
 */
export const AsnNumericStringConverter = createStringConverter(asn1.NumericString);
/**
 * ASN.1 PRINTABLE STRING converter
 */
export const AsnPrintableStringConverter = createStringConverter(asn1.PrintableString);
/**
 * ASN.1 TELETEX STRING converter
 */
export const AsnTeletexStringConverter = createStringConverter(asn1.TeletexString);
/**
 * ASN.1 VIDEOTEX STRING converter
 */
export const AsnVideotexStringConverter = createStringConverter(asn1.VideotexString);
/**
 * ASN.1 IA5 STRING converter
 */
export const AsnIA5StringConverter = createStringConverter(asn1.IA5String);
/**
 * ASN.1 GRAPHIC STRING converter
 */
export const AsnGraphicStringConverter = createStringConverter(asn1.GraphicString);
/**
 * ASN.1 VISIBLE STRING converter
 */
export const AsnVisibleStringConverter = createStringConverter(asn1.VisibleString);
/**
 * ASN.1 GENERAL STRING converter
 */
export const AsnGeneralStringConverter = createStringConverter(asn1.GeneralString);
/**
 * ASN.1 CHARACTER STRING converter
 */
export const AsnCharacterStringConverter = createStringConverter(asn1.CharacterString);

/**
 * ASN.1 UTCTime converter
 */
export const AsnUTCTimeConverter: IAsnConverter<Date> = {
  fromASN: (value: any) => value.toDate(),
  toASN: (value: Date) => new asn1.UTCTime({ valueDate: value }),
};
/**
 * ASN.1 GeneralizedTime converter
 */
export const AsnGeneralizedTimeConverter: IAsnConverter<Date> = {
  fromASN: (value: any) => value.toDate(),
  toASN: (value: Date) => new asn1.GeneralizedTime({ valueDate: value }),
};

/**
 * ASN.1 ANY converter
 */
export const AsnNullConverter: IAsnConverter<null> = {
  fromASN: (value: any) => null,
  toASN: (value: null) => {
    return new asn1.Null();
  },
};

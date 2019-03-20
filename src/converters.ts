/// <reference path="./@types/asn1js.d.ts" />

import * as asn1 from "asn1js";
import { AnyConverterType, IAsnConverter, IntegerConverterType } from "./types";
/**
 * NOTE: Converter MUST have name Asn<Asn1PropType.name>Converter.
 * Asn1Prop decorator link custom converters by name of the Asn1PropType
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

export const AsnIntegerConverter: IAsnConverter<IntegerConverterType> = {
  fromASN: (value: any) => !value.valueBlock.valueDec && value.valueBlock.valueHex.byteLength > 0 ?
    value.valueBlock.toString() // Convert number to string
    : value.valueBlock.valueDec, // use number format
  toASN: (value: IntegerConverterType) => new asn1.Integer({ value }),
};

export const AsnEnumeratedConverter: IAsnConverter<number> = {
  fromASN: (value: any) => value.valueBlock.valueDec,
  toASN: (value: number) => new asn1.Enumerated({ value }),
};

export const AsnIntegerArrayBufferConverter: IAsnConverter<ArrayBuffer> = {
  fromASN: (value: any) => value.valueBlock.valueHex,
  toASN: (value: ArrayBuffer) => new asn1.Integer({ valueHex: value }),
};

export const AsnBitStringConverter: IAsnConverter<ArrayBuffer> = {
  fromASN: (value: any) => value.valueBlock.valueHex,
  toASN: (value: ArrayBuffer) => new asn1.BitString({ valueHex: value }),
};

export const AsnObjectIdentifierConverter: IAsnConverter<string> = {
  fromASN: (value: any) => value.valueBlock.toString(),
  toASN: (value: string) => new asn1.ObjectIdentifier({ value }),
};

export const AsnBooleanConverter: IAsnConverter<boolean> = {
  fromASN: (value: any) => value.valueBlock.value,
  toASN: (value: boolean) => new asn1.Boolean({ value }),
};

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

export const AsnUtf8StringConverter = createStringConverter(asn1.Utf8String);
export const AsnBmpStringConverter = createStringConverter(asn1.BmpString);
export const AsnUniversalStringConverter = createStringConverter(asn1.UniversalString);
export const AsnNumericStringConverter = createStringConverter(asn1.NumericString);
export const AsnPrintableStringConverter = createStringConverter(asn1.PrintableString);
export const AsnTeletexStringConverter = createStringConverter(asn1.TeletexString);
export const AsnVideotexStringConverter = createStringConverter(asn1.VideotexString);
export const AsnIA5StringConverter = createStringConverter(asn1.IA5String);
export const AsnGraphicStringConverter = createStringConverter(asn1.GraphicString);
export const AsnVisibleStringConverter = createStringConverter(asn1.VisibleString);
export const AsnGeneralStringConverter = createStringConverter(asn1.GeneralString);
export const AsnCharacterStringConverter = createStringConverter(asn1.CharacterString);

export const AsnUTCTimeConverter: IAsnConverter<Date> = {
  fromASN: (value: any) => value.toDate(),
  toASN: (value: Date) => new asn1.UTCTime({ valueDate: value }),
};
export const AsnGeneralizedTimeConverter: IAsnConverter<Date> = {
  fromASN: (value: any) => value.toDate(),
  toASN: (value: Date) => new asn1.GeneralizedTime({ valueDate: value }),
};

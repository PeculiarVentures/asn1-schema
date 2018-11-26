declare namespace Asn1Schema {

  //#region Converters

  interface IAsnConverter<T = any, AsnType = any> {
    fromASN(value: AsnType): T;
    toASN(value: T): AsnType;
  }

  interface IAsnConvertible<T> {
    fromASN(asn: T): this;
    toASN(): T;
  }

  type IntergerConverterType = string | number;
  type AnyConverterType = ArrayBuffer | null;

  const AsnAnyConverter: IAsnConverter<AnyConverterType>;
  const AsnIntegerConverter: IAsnConverter<IntergerConverterType>;
  const AsnEnumeratedConverter: IAsnConverter<number>;
  const AsnIntegerArrayBufferConverter: IAsnConverter<ArrayBuffer>;
  const AsnBitStringConverter: IAsnConverter<ArrayBuffer>;
  const AsnObjectIdentifierConverter: IAsnConverter<string>;
  const AsnBooleanConverter: IAsnConverter<boolean>;
  const AsnOctetStringConverter: IAsnConverter<ArrayBuffer>;
  const AsnUtf8StringConverter: IAsnConverter<string>;
  const AsnBmpStringConverter: IAsnConverter<string>;
  const AsnUniversalStringConverter: IAsnConverter<string>;
  const AsnNumericStringConverter: IAsnConverter<string>;
  const AsnPrintableStringConverter: IAsnConverter<string>;
  const AsnTeletexStringConverter: IAsnConverter<string>;
  const AsnVideotexStringConverter: IAsnConverter<string>;
  const AsnIA5StringConverter: IAsnConverter<string>;
  const AsnGraphicStringConverter: IAsnConverter<string>;
  const AsnVisibleStringConverter: IAsnConverter<string>;
  const AsnGeneralStringConverter: IAsnConverter<string>;
  const AsnCharacterStringConverter: IAsnConverter<string>;
  const AsnUTCTimeConverter: IAsnConverter<Date>;
  const AsnGeneralizedTimeConverter: IAsnConverter<Date>;

  //#endregion

  enum AsnPropTypes {
    Any,
    Boolean,
    OctetString,
    BitString,
    Integer,
    Enumerated,
    ObjectIdentifier,
    Utf8String,
    BmpString,
    UniversalString,
    NumericString,
    PrintableString,
    TeletexString,
    VideotexString,
    IA5String,
    GraphicString,
    VisibleString,
    GeneralString,
    CharacterString,
    UTCTime,
    GeneralizedTime,
    DATE,
    TimeOfDay,
    DateTime,
    Duration,
    TIME,
    Null,
  }

  enum AsnTypeTypes {
    Sequence,
    Set,
    Choice,
  }

  interface IEmptyConstructor<T> {
    new(): T;
  }

  interface IAsnTypeOptions {
    type: AsnTypeTypes;
  }

  interface IAsnPropOptions {
    type: AsnPropTypes | IEmptyConstructor<any>;
    optional?: boolean;
    defaultValue?: any;
    context?: number;
    implicit?: boolean;
    converter?: IAsnConverter<any>;
    repeated?: boolean;
  }

  interface IAsnSchema extends IAsnTypeOptions {
    items: { [key: string]: IAsnPropOptions };
    schema?: any;
  }

  const AsnType: (options: IAsnTypeOptions) => ClassDecorator;
  const AsnProp: (options: IAsnPropOptions) => PropertyDecorator;

  class AsnParser {
    public static parse<T>(data: BufferSource, target: IEmptyConstructor<T>, obj?: T): T;
    public static fromASN<T>(asn1Schema: any, target: IEmptyConstructor<T>, obj?: T): T;
  }

  class AsnSerializer {
    public static serialize(obj: any): ArrayBuffer;
    public static toASN(obj: any): any;
  }

}

export = Asn1Schema;

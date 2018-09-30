declare namespace Asn1Schema {

  //#region Converters

  interface IAsn1Converter<T = any, AsnType = any> {
    fromASN(value: AsnType): T;
    toASN(value: T): AsnType;
  }

  interface IAsn1Convertible<T> {
    fromASN(asn: T): this;
    toASN(): T;
  }

  type IntergerConverterType = string | number;
  type AnyConverterType = ArrayBuffer | null;

  const AsnAnyConverter: IAsn1Converter<AnyConverterType>;
  const AsnIntegerConverter: IAsn1Converter<IntergerConverterType>;
  const AsnEnumeratedConverter: IAsn1Converter<number>;
  const AsnIntegerArrayBufferConverter: IAsn1Converter<ArrayBuffer>;
  const AsnBitStringConverter: IAsn1Converter<ArrayBuffer>;
  const AsnObjectIdentifierConverter: IAsn1Converter<string>;
  const AsnBooleanConverter: IAsn1Converter<boolean>;
  const AsnOctetStringConverter: IAsn1Converter<ArrayBuffer>;
  const AsnUtf8StringConverter: IAsn1Converter<string>;
  const AsnBmpStringConverter: IAsn1Converter<string>;
  const AsnUniversalStringConverter: IAsn1Converter<string>;
  const AsnNumericStringConverter: IAsn1Converter<string>;
  const AsnPrintableStringConverter: IAsn1Converter<string>;
  const AsnTeletexStringConverter: IAsn1Converter<string>;
  const AsnVideotexStringConverter: IAsn1Converter<string>;
  const AsnIA5StringConverter: IAsn1Converter<string>;
  const AsnGraphicStringConverter: IAsn1Converter<string>;
  const AsnVisibleStringConverter: IAsn1Converter<string>;
  const AsnGeneralStringConverter: IAsn1Converter<string>;
  const AsnCharacterStringConverter: IAsn1Converter<string>;
  const AsnUTCTimeConverter: IAsn1Converter<Date>;
  const AsnGeneralizedTimeConverter: IAsn1Converter<Date>;

  //#endregion

  enum Asn1PropTypes {
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

  enum Asn1TypeTypes {
    Sequence,
    Set,
    Choice,
  }

  interface IEmptyConstructor<T> {
    new(): T;
  }

  interface IAsn1TypeOptions {
    type: Asn1TypeTypes;
  }

  interface IAsn1PropOptions {
    type: Asn1PropTypes | IEmptyConstructor<any>;
    optional?: boolean;
    defaultValue?: any;
    context?: number;
    implicit?: boolean;
    converter?: IAsn1Converter<any>;
    repeated?: boolean;
  }

  interface IAsn1Schema extends IAsn1TypeOptions {
    items: { [key: string]: IAsn1PropOptions };
    schema?: any;
  }

  const Asn1Type: (options: IAsn1TypeOptions) => ClassDecorator;
  const Asn1Prop: (options: IAsn1PropOptions) => PropertyDecorator;

  class Asn1Parser {
    public static parse<T>(data: BufferSource, target: IEmptyConstructor<T>, obj?: T): T;
    public static fromASN<T>(asn1Schema: any, target: IEmptyConstructor<T>, obj?: T): T;
  }

  class Asn1Serializer {
    public static serialize(obj: any): ArrayBuffer;
    public static toASN(obj: any): any;
  }

}

export = Asn1Schema;

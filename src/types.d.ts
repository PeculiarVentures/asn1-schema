/**
 * ASN1 type
 */

interface IEmptyConstructor<T> {
  new(): T;
}

interface IAsn1Converter<T = any, AsnType = any> {
  fromASN(value: AsnType): T;
  toASN(value: T): AsnType;
}

type IntergerConverterType = string | number;
type AnyConverterType = ArrayBuffer | null;

interface IAsn1Convertible<T = any> {
  fromASN(asn: T): this;
  toASN(): T;
}

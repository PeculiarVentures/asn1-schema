/**
 * ASN1 type
 */

export interface IEmptyConstructor<T> {
  new(): T;
}

export interface IAsnConverter<T = any, AsnType = any> {
  fromASN(value: AsnType): T;
  toASN(value: T): AsnType;
}

export type IntegerConverterType = string | number;
export type AnyConverterType = ArrayBuffer | null;

export interface IAsnConvertible<T = any> {
  fromASN(asn: T): this;
  toASN(): T;
}

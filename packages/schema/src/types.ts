import { AsnNode, ParseContext } from "@peculiar/asn1-codec";

export interface AsnNodeType {
  node: AsnNode;
  context: ParseContext;
}

export interface IEmptyConstructor<T = unknown> {
  new (): T;
}

/**
 * Allows to convert ASN.1 object to JS value and back
 */
export interface IAsnConverter<T = unknown> {
  /**
   * Returns JS value from ASN.1 object
   * @param value ASN.1 object from asn1js module
   */
  fromASN(value: AsnNodeType): T;
  /**
   * Returns ASN.1 object from JS value
   * @param value JS value
   */
  toASN(value: T): AsnNode;
}

export type IntegerConverterType = string | number;
export type AnyConverterType = ArrayBuffer | null;

/**
 * Allows an object to control its own ASN.1 serialization and deserialization
 */
export interface IAsnConvertible {
  fromASN(asn: AsnNodeType): this;
  toASN(): AsnNode;
}

export interface IAsnConvertibleConstructor {
  new (): IAsnConvertible;
}

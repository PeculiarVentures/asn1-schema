import { AsnProp, AsnPropTypes, AsnArray, AsnType, AsnTypeTypes } from "@peculiar/asn1-schema";
import { AlgorithmIdentifier, Attribute } from "@peculiar/asn1-x509";

/**
 * ```
 * Version ::= INTEGER {v1(0)} (v1,...)
 * ```
 */
export type Version = number;

/**
 * ```
 * PrivateKey ::= OCTET STRING
 * ```
 */
export type PrivateKey = ArrayBuffer;

/**
 * ```
 * Attributes ::= SET OF Attribute
 * ```
 */
@AsnType({ type: AsnTypeTypes.Sequence, itemType: Attribute })
export class Attributes extends AsnArray<Attribute> { }

/**
 * ```
 * PrivateKeyInfo ::= SEQUENCE {
 *   version Version,
 *   privateKeyAlgorithm AlgorithmIdentifier {{PrivateKeyAlgorithms}},
 *   privateKey PrivateKey,
 *   attributes [0] Attributes OPTIONAL }
 * ```
 */
export class PrivateKeyInfo {

  @AsnProp({ type: AsnPropTypes.Integer })
  public version: Version = 0;
  
  @AsnProp({ type: AlgorithmIdentifier })
  public privateKeyAlgorithm = new AlgorithmIdentifier();

  @AsnProp({ type: AsnPropTypes.OctetString })
  public privateKey: PrivateKey = new ArrayBuffer(0);

  @AsnProp({ type: Attributes, implicit: true, context: 0, optional: true })
  public attributes = new Attributes();
}
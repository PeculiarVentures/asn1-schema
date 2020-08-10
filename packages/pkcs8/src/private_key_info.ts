import { AsnProp, AsnPropTypes, AsnArray, AsnType, AsnTypeTypes, OctetString } from "@peculiar/asn1-schema";
import { AlgorithmIdentifier, Attribute } from "@peculiar/asn1-x509";

/**
 * ```
 * Version ::= INTEGER {v1(0)} (v1,...)
 * ```
 */
export enum Version {
  v1 = 0,
}

/**
 * ```
 * PrivateKey ::= OCTET STRING
 * ```
 */
export class PrivateKey extends OctetString { }

/**
 * ```
 * Attributes ::= SET OF Attribute
 * ```
 */
@AsnType({ type: AsnTypeTypes.Sequence, itemType: Attribute })
export class Attributes extends AsnArray<Attribute> {

  constructor(items?: Attribute[]) {
    super(items);

    // Set the prototype explicitly.
    Object.setPrototypeOf(this, Attributes.prototype);
  }

}

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
  public version = Version.v1;

  @AsnProp({ type: AlgorithmIdentifier })
  public privateKeyAlgorithm = new AlgorithmIdentifier();

  @AsnProp({ type: PrivateKey })
  public privateKey = new PrivateKey();

  @AsnProp({ type: Attributes, implicit: true, context: 0, optional: true })
  public attributes?: Attributes;

  constructor(params: Partial<PrivateKeyInfo> = {}) {
    Object.assign(this, params);
  }
}
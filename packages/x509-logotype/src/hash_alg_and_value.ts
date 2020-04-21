import { AsnProp, AsnPropTypes } from "@peculiar/asn1-schema";
import { AlgorithmIdentifier } from "@peculiar/asn1-x509";

/**
 * ```
 * HashAlgAndValue ::= SEQUENCE {
 *   hashAlg         AlgorithmIdentifier,
 *   hashValue       OCTET STRING }
 * ```
 */
export class HashAlgAndValue {

  @AsnProp({ type: AlgorithmIdentifier })
  public hashAlg = new AlgorithmIdentifier();

  @AsnProp({ type: AsnPropTypes.OctetString })
  public hashValue = new ArrayBuffer(0);

  constructor(params: Partial<HashAlgAndValue> = {}) {
    Object.assign(this, params);
  }
}

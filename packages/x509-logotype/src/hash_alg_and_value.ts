import { AsnProp, OctetString } from "@peculiar/asn1-schema";
import { AlgorithmIdentifier } from "@peculiar/asn1-x509";

/**
 * ```asn1
 * HashAlgAndValue ::= SEQUENCE {
 *   hashAlg         AlgorithmIdentifier,
 *   hashValue       OCTET STRING }
 * ```
 */
export class HashAlgAndValue {
  @AsnProp({ type: AlgorithmIdentifier })
  public hashAlg = new AlgorithmIdentifier();

  @AsnProp({ type: OctetString })
  public hashValue = new OctetString();

  constructor(params: Partial<HashAlgAndValue> = {}) {
    Object.assign(this, params);
  }
}

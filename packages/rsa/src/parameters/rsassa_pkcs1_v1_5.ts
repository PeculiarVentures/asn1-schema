import { AlgorithmIdentifier } from "@peculiar/asn1-x509";
import { AsnProp, OctetString } from "@peculiar/asn1-schema";

/**
 * ```
 * DigestInfo ::= SEQUENCE {
 *   digestAlgorithm DigestAlgorithm,
 *   digest OCTET STRING
 * }
 * ```
 */
export class DigestInfo {

  @AsnProp({ type: AlgorithmIdentifier })
  public digestAlgorithm = new AlgorithmIdentifier();

  @AsnProp({ type: OctetString })
  public digest = new OctetString();

  constructor(params: Partial<DigestInfo> = {}) {
    Object.assign(this, params);
  }
}
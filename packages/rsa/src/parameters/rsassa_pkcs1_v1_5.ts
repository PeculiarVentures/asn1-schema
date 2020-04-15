import { AlgorithmIdentifier } from "@peculiar/asn1-x509";
import { AsnProp, AsnPropTypes } from "@peculiar/asn1-schema";

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

  @AsnProp({ type: AsnPropTypes.OctetString })
  public digest = new ArrayBuffer(0);

  constructor(params: Partial<DigestInfo> = {}) {
    Object.assign(this, params);
  }
}
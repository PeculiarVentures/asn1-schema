import { AsnProp, AsnPropTypes } from "@peculiar/asn1-schema";
import { AlgorithmIdentifier, Certificate } from "@peculiar/asn1-x509";

/**
 * ```asn1
 * Signature       ::=     SEQUENCE {
 *   signatureAlgorithm      AlgorithmIdentifier,
 *   signature               BIT STRING,
 *   certs               [0] EXPLICIT SEQUENCE OF Certificate
 * OPTIONAL}
 * ```
 */
export class Signature {
  @AsnProp({ type: AlgorithmIdentifier })
  public signatureAlgorithm = new AlgorithmIdentifier();

  @AsnProp({ type: AsnPropTypes.BitString })
  public signature = new ArrayBuffer(0);

  @AsnProp({ type: Certificate, repeated: "sequence", optional: true, context: 0 })
  public certs?: Certificate[];

  constructor(params: Partial<Signature> = {}) {
    Object.assign(this, params);
  }
}

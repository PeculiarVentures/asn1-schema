import { AsnProp, AsnPropTypes, AsnIntegerArrayBufferConverter } from "@peculiar/asn1-schema";

// re-ocsp-crl EXTENSION ::= { SYNTAX CrlID IDENTIFIED BY
//                                 id-pkix-ocsp-crl }

/**
 * ```asn1
 * CrlID ::= SEQUENCE {
 *     crlUrl               [0]     EXPLICIT IA5String OPTIONAL,
 *     crlNum               [1]     EXPLICIT INTEGER OPTIONAL,
 *     crlTime              [2]     EXPLICIT GeneralizedTime OPTIONAL }
 * ```
 */
export class CrlID {
  @AsnProp({ type: AsnPropTypes.IA5String, context: 0, optional: true })
  public crlUrl?: string;

  @AsnProp({
    type: AsnPropTypes.Integer,
    context: 1,
    optional: true,
    converter: AsnIntegerArrayBufferConverter,
  })
  public crlNum?: ArrayBuffer;

  @AsnProp({ type: AsnPropTypes.GeneralizedTime, context: 2, optional: true })
  public crlTime?: Date;

  constructor(params: Partial<CrlID> = {}) {
    Object.assign(this, params);
  }
}

import { AsnProp, AsnPropTypes } from "@peculiar/asn1-schema";
import { CRLReason } from "@peculiar/asn1-x509";

/**
 * ```
 * RevokedInfo ::= SEQUENCE {
 *   revocationTime              GeneralizedTime,
 *   revocationReason    [0]     EXPLICIT CRLReason OPTIONAL }
 * ```
 */
export class RevokedInfo {

  @AsnProp({ type: AsnPropTypes.GeneralizedTime })
  public revocationTime = new Date();

  @AsnProp({ type: CRLReason, context: 0, optional: true })
  public revocationReason?: CRLReason;

  constructor(params: Partial<RevokedInfo> = {}) {
    Object.assign(this, params);
  }
}
import { AsnProp, AsnPropTypes } from "@peculiar/asn1-schema";

/**
 * ```
 * AttCertValidityPeriod  ::= SEQUENCE {
 *      notBeforeTime  GeneralizedTime,
 *      notAfterTime   GeneralizedTime
 * }
 * ```
 */
export class AttCertValidityPeriod {

  @AsnProp({ type: AsnPropTypes.GeneralizedTime })
  public notBeforeTime = new Date();

  @AsnProp({ type: AsnPropTypes.GeneralizedTime })
  public notAfterTime = new Date();

  constructor(params: Partial<AttCertValidityPeriod> = {}) {
    Object.assign(this, params);
  }
}

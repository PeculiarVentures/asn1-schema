import { AsnProp, AsnPropTypes } from "@peculiar/asn1-schema";
import { id_ce } from "../object_identifiers";

/**
 * ```asn1
 * id-ce-privateKeyUsagePeriod OBJECT IDENTIFIER ::=  { id-ce 16 }
 * ```
 */
export const id_ce_privateKeyUsagePeriod = `${id_ce}.16`;

/**
 * ```asn1
 * PrivateKeyUsagePeriod ::= SEQUENCE {
 *     notBefore       [0]     GeneralizedTime OPTIONAL,
 *     notAfter        [1]     GeneralizedTime OPTIONAL }
 * ```
 */
export class PrivateKeyUsagePeriod {
  @AsnProp({ type: AsnPropTypes.GeneralizedTime, context: 0, implicit: true, optional: true })
  public notBefore?: Date;

  @AsnProp({ type: AsnPropTypes.GeneralizedTime, context: 1, implicit: true, optional: true })
  public notAfter?: Date;

  constructor(params: Partial<PrivateKeyUsagePeriod> = {}) {
    Object.assign(this, params);
  }
}

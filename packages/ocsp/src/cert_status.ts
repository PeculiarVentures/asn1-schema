import { AsnProp, AsnType, AsnTypeTypes, AsnPropTypes } from "@peculiar/asn1-schema";
import { RevokedInfo } from "./revoked_info";

/**
 * ```asn1
 * UnknownInfo ::= NULL
 * ```
 */
export type UnknownInfo = null;

/**
 * ```asn1
 * CertStatus ::= CHOICE {
 *   good                [0]     IMPLICIT NULL,
 *   revoked             [1]     IMPLICIT RevokedInfo,
 *   unknown             [2]     IMPLICIT UnknownInfo }
 * ```
 */
@AsnType({ type: AsnTypeTypes.Choice })
export class CertStatus {
  @AsnProp({ type: AsnPropTypes.Null, context: 0, implicit: true })
  public good?: null;

  @AsnProp({ type: RevokedInfo, context: 1, implicit: true })
  public revoked?: RevokedInfo;

  @AsnProp({ type: AsnPropTypes.Null, context: 2, implicit: true })
  public unknown?: UnknownInfo;

  constructor(params: Partial<CertStatus> = {}) {
    Object.assign(this, params);
  }
}

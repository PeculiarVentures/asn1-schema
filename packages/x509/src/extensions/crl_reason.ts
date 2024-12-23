import { AsnProp, AsnPropTypes, AsnType, AsnTypeTypes } from "@peculiar/asn1-schema";
import { id_ce } from "../object_identifiers";

/**
 * ```asn1
 * id-ce-cRLReasons OBJECT IDENTIFIER ::= { id-ce 21 }
 * ```
 */
export const id_ce_cRLReasons = `${id_ce}.21`;

export enum CRLReasons {
  unspecified = 0,
  keyCompromise = 1,
  cACompromise = 2,
  affiliationChanged = 3,
  superseded = 4,
  cessationOfOperation = 5,
  certificateHold = 6,
  removeFromCRL = 8,
  privilegeWithdrawn = 9,
  aACompromise = 10,
}

/**
 * ```asn1
 * CRLReason ::= ENUMERATED {
 *   unspecified             (0),
 *   keyCompromise           (1),
 *   cACompromise            (2),
 *   affiliationChanged      (3),
 *   superseded              (4),
 *   cessationOfOperation    (5),
 *   certificateHold         (6),
 *        -- value 7 is not used
 *   removeFromCRL           (8),
 *   privilegeWithdrawn      (9),
 *   aACompromise           (10) }
 * ```
 */
@AsnType({ type: AsnTypeTypes.Choice })
export class CRLReason {
  @AsnProp({ type: AsnPropTypes.Enumerated })
  public reason: CRLReasons = CRLReasons.unspecified;

  constructor(reason: CRLReasons = CRLReasons.unspecified) {
    this.reason = reason;
  }

  public toJSON(): string {
    return CRLReasons[this.reason];
  }

  public toString(): string {
    return this.toJSON();
  }
}

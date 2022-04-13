import { AsnProp, AsnType, AsnTypeTypes, AsnArray, BitString } from "@peculiar/asn1-schema";
import { RelativeDistinguishedName } from "../name";
import { GeneralName } from "../general_name";
import { id_ce } from "../object_identifiers";

/**
 * ```
 * id-ce-cRLDistributionPoints OBJECT IDENTIFIER ::=  { id-ce 31 }
 * ```
 */
export const id_ce_cRLDistributionPoints = `${id_ce}.31`;

export type ReasonType = "unused" | "keyCompromise" | "cACompromise" | "affiliationChanged" | "superseded"
  | "cessationOfOperation" | "certificateHold" | "privilegeWithdrawn" | "aACompromise";

export enum ReasonFlags {
  unused = 0x0001,
  keyCompromise = 0x0002,
  cACompromise = 0x0004,
  affiliationChanged = 0x0008,
  superseded = 0x0010,
  cessationOfOperation = 0x0020,
  certificateHold = 0x0040,
  privilegeWithdrawn = 0x0080,
  aACompromise = 0x0100,
}

/**
 * ```
 * ReasonFlags ::= BIT STRING {
 *   unused                  (0),
 *   keyCompromise           (1),
 *   cACompromise            (2),
 *   affiliationChanged      (3),
 *   superseded              (4),
 *   cessationOfOperation    (5),
 *   certificateHold         (6),
 *   privilegeWithdrawn      (7),
 *   aACompromise            (8) }
 * ```
 */
export class Reason extends BitString {

  public toJSON() {
    const res: ReasonType[] = [];
    const flags = this.toNumber();
    if (flags & ReasonFlags.aACompromise) {
      res.push("aACompromise");
    }
    if (flags & ReasonFlags.affiliationChanged) {
      res.push("affiliationChanged");
    }
    if (flags & ReasonFlags.cACompromise) {
      res.push("cACompromise");
    }
    if (flags & ReasonFlags.certificateHold) {
      res.push("certificateHold");
    }
    if (flags & ReasonFlags.cessationOfOperation) {
      res.push("cessationOfOperation");
    }
    if (flags & ReasonFlags.keyCompromise) {
      res.push("keyCompromise");
    }
    if (flags & ReasonFlags.privilegeWithdrawn) {
      res.push("privilegeWithdrawn");
    }
    if (flags & ReasonFlags.superseded) {
      res.push("superseded");
    }
    if (flags & ReasonFlags.unused) {
      res.push("unused");
    }
    return res;
  }

  public toString() {
    return `[${this.toJSON().join(", ")}]`;
  }
}

/**
 * ```
 * DistributionPointName ::= CHOICE {
 *   fullName                [0]     GeneralNames,
 *   nameRelativeToCRLIssuer [1]     RelativeDistinguishedName }
 * ```
 */
@AsnType({ type: AsnTypeTypes.Choice })
export class DistributionPointName {

  @AsnProp({ type: GeneralName, context: 0, repeated: "sequence", implicit: true })
  public fullName?: GeneralName[];

  @AsnProp({ type: RelativeDistinguishedName, context: 1, implicit: true })
  public nameRelativeToCRLIssuer?: RelativeDistinguishedName;

  constructor(params: Partial<DistributionPointName> = {}) {
    Object.assign(this, params);
  }
}

/**
 * ```
 * DistributionPoint ::= SEQUENCE {
 *   distributionPoint       [0]     DistributionPointName OPTIONAL,
 *   reasons                 [1]     ReasonFlags OPTIONAL,
 *   cRLIssuer               [2]     GeneralNames OPTIONAL }
 * ```
 */
export class DistributionPoint {

  @AsnProp({ type: DistributionPointName, context: 0, optional: true })
  public distributionPoint?: DistributionPointName;

  @AsnProp({ type: Reason, context: 1, optional: true, implicit: true })
  public reasons?: Reason;

  @AsnProp({ type: GeneralName, context: 2, optional: true, repeated: "sequence", implicit: true })
  public cRLIssuer?: GeneralName[];

  constructor(params: Partial<DistributionPoint> = {}) {
    Object.assign(this, params);
  }
}

/**
 * ```
 * CRLDistributionPoints ::= SEQUENCE SIZE (1..MAX) OF DistributionPoint
 * ```
 */
@AsnType({ type: AsnTypeTypes.Sequence, itemType: DistributionPoint })
export class CRLDistributionPoints extends AsnArray<DistributionPoint> {

  constructor(items?: DistributionPoint[]) {
    super(items);

    // Set the prototype explicitly.
    Object.setPrototypeOf(this, CRLDistributionPoints.prototype);
  }

}

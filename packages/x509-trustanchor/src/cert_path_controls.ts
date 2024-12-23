import { Name, Certificate, CertificatePolicies, NameConstraints } from "@peculiar/asn1-x509";
import { AsnProp, AsnPropTypes, BitString } from "@peculiar/asn1-schema";

export type CertPolicyType = "inhibitPolicyMapping" | "requireExplicitPolicy" | "inhibitAnyPolicy";

/**
 * ```
 * CertPolicyFlags ::= BIT STRING {
 *   inhibitPolicyMapping    (0),
 *   requireExplicitPolicy   (1),
 *   inhibitAnyPolicy        (2) }
 * ```
 */
export enum CertPolicyFlags {
  inhibitPolicyMapping = 0x01,
  requireExplicitPolicy = 0x02,
  inhibitAnyPolicy = 0x04,
}

export class CertPolicy extends BitString<CertPolicyFlags> {
  public toJSON(): CertPolicyType[] {
    const res: CertPolicyType[] = [];
    const flags = this.toNumber();
    if (flags & CertPolicyFlags.inhibitAnyPolicy) {
      res.push("inhibitAnyPolicy");
    }
    if (flags & CertPolicyFlags.inhibitPolicyMapping) {
      res.push("inhibitPolicyMapping");
    }
    if (flags & CertPolicyFlags.requireExplicitPolicy) {
      res.push("requireExplicitPolicy");
    }
    return res;
  }

  public override toString(): string {
    return `[${this.toJSON().join(", ")}]`;
  }
}

/**
 * ```
 * CertPathControls ::= SEQUENCE {
 *   taName           Name,
 *   certificate      [0] Certificate OPTIONAL,
 *   policySet        [1] CertificatePolicies OPTIONAL,
 *   policyFlags      [2] CertPolicyFlags OPTIONAL,
 *   nameConstr       [3] NameConstraints OPTIONAL,
 *   pathLenConstraint[4] INTEGER (0..MAX) OPTIONAL}
 * ```
 */
export class CertPathControls {
  @AsnProp({ type: Name })
  public taName = new Name();

  @AsnProp({ type: Certificate, implicit: true, context: 0, optional: true })
  public certificate?: Certificate;

  @AsnProp({ type: CertificatePolicies, implicit: true, context: 1, optional: true })
  public policySet?: CertificatePolicies;

  @AsnProp({ type: CertPolicy, implicit: true, context: 2, optional: true })
  public policyFlags?: CertPolicy;

  @AsnProp({ type: NameConstraints, implicit: true, context: 3, optional: true })
  public nameConstr?: NameConstraints;

  @AsnProp({ type: AsnPropTypes.Integer, implicit: true, context: 4, optional: true })
  public pathLenConstraint?: number;

  constructor(params: Partial<CertPathControls> = {}) {
    Object.assign(this, params);
  }
}

import { Name, Certificate, CertificatePolicies, NameConstraints } from "@peculiar/asn1-x509";
import { AsnProp, AsnPropTypes, IAsnConverter } from "@peculiar/asn1-schema";
import { BitString } from "asn1js";

/**
 * ```
 * CertPolicyFlags ::= BIT STRING {
 *   inhibitPolicyMapping    (0),
 *   requireExplicitPolicy   (1),
 *   inhibitAnyPolicy        (2) }
 * ```
 */
export enum CertPolicyFlags {
  inhibitPolicyMapping = 0x80,
  requireExplicitPolicy = 0x40,
  inhibitAnyPolicy = 0x20,
}

export const AsnCertPolicyFlagsConverter: IAsnConverter<CertPolicyFlags> = {
  fromASN: (value: any) => {
    const valueHex = new Uint8Array(value.valueBlock.valueHex);
    const unusedBits = value.valueBlock.unusedBits;
    let flag = valueHex[0];
    flag >>= unusedBits;
    flag <<= unusedBits;
    return flag;
  },
  toASN: (value: CertPolicyFlags) => {
    const valueHex = new Uint8Array([value]);
    let unusedBits = 0;
    return new BitString({ unusedBits, valueHex: valueHex.buffer });
  },
};

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
  
  @AsnProp({
    type: AsnPropTypes.BitString, implicit: true, context: 2, optional: true,
    converter: AsnCertPolicyFlagsConverter,
  })
  public policyFlags?: CertPolicyFlags;
  
  @AsnProp({ type: NameConstraints, implicit: true, context: 3, optional: true })
  public nameConstr?: NameConstraints;
  
  @AsnProp({ type: AsnPropTypes.Integer, implicit: true, context: 4, optional: true })
  public pathLenConstraint?: number;

  constructor(params: Partial<CertPathControls> = {}) {
    Object.assign(this, params);
  }
}

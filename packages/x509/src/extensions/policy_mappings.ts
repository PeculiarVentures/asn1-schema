import { AsnArray, AsnProp, AsnPropTypes, AsnType, AsnTypeTypes } from "@peculiar/asn1-schema";
import { id_ce } from "../object_identifiers";
import { CertPolicyId } from "./certificate_policies";

/**
 * ```
 * id-ce-policyMappings OBJECT IDENTIFIER ::=  { id-ce 33 }
 * ```
 */
export const id_ce_policyMappings = `${id_ce}.33`;

/**
 * ```
 * PolicyMapping ::= SEQUENCE {
 *   issuerDomainPolicy      CertPolicyId,
 *   subjectDomainPolicy     CertPolicyId }
 * ```
 */
export class PolicyMapping {

  @AsnProp({ type: AsnPropTypes.ObjectIdentifier })
  public issuerDomainPolicy: CertPolicyId = "";

  @AsnProp({ type: AsnPropTypes.ObjectIdentifier })
  public subjectDomainPolicy: CertPolicyId = "";

  constructor(params: Partial<PolicyMappings> = {}) {
    Object.assign(this, params);
  }
}

/**
 * ```
 * PolicyMappings ::= SEQUENCE SIZE (1..MAX) OF PolicyMapping
 * ```
 */
@AsnType({ type: AsnTypeTypes.Sequence, itemType: PolicyMapping })
export class PolicyMappings extends AsnArray<PolicyMapping>{

  constructor(items?: PolicyMapping[]) {
    super(items);

    // Set the prototype explicitly.
    Object.setPrototypeOf(this, PolicyMappings.prototype);
  }

}
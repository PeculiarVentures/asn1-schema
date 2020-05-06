import { AsnProp, AsnPropTypes } from "@peculiar/asn1-schema";
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
 * PolicyMappings ::= SEQUENCE SIZE (1..MAX) OF SEQUENCE {
 *   issuerDomainPolicy      CertPolicyId,
 *   subjectDomainPolicy     CertPolicyId }
 * ```
 */
export class PolicyMappings {

  @AsnProp({ type: AsnPropTypes.ObjectIdentifier })
  public issuerDomainPolicy: CertPolicyId = "";

  @AsnProp({ type: AsnPropTypes.ObjectIdentifier })
  public subjectDomainPolicy: CertPolicyId = "";

  constructor(params: Partial<PolicyMappings> = {}) {
    Object.assign(this, params);
  }
}

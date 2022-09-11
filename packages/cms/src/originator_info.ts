import { AsnProp } from "@peculiar/asn1-schema";
import { CertificateSet } from "./certificate_choices";
import { RevocationInfoChoices } from "./revocation_info_choice";

/**
 * ```asn
 * OriginatorInfo ::= SEQUENCE {
 *  certs [0] IMPLICIT CertificateSet OPTIONAL,
 *  crls [1] IMPLICIT RevocationInfoChoices OPTIONAL }
 * ```
 */
export class OriginatorInfo {

  @AsnProp({ type: CertificateSet, context: 0, implicit: true, optional: true })
  public certs?: CertificateSet;

  @AsnProp({ type: RevocationInfoChoices, context: 1, implicit: true, optional: true })
  public crls?: RevocationInfoChoices;

  constructor(params: Partial<OriginatorInfo> = {}) {
    Object.assign(this, params);
  }
}
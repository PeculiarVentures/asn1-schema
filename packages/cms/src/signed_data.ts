import { AsnProp, AsnPropTypes } from "@peculiar/asn1-schema";
import { CertificateSet, CertificateChoices } from "./certificate_choices";
import { CMSVersion, DigestAlgorithmIdentifier } from "./types";
import { EncapsulatedContentInfo } from "./encapsulated_content_info";
import { RevocationInfoChoice, RevocationInfoChoices } from "./revocation_info_choice";
import { SignerInfos, SignerInfo } from "./signer_info";

/**
 * ```
 * DigestAlgorithmIdentifiers ::= SET OF DigestAlgorithmIdentifier
 * ```
 */
export type DigestAlgorithmIdentifiers = DigestAlgorithmIdentifier[];

/**
 * ```
 * SignedData ::= SEQUENCE {
 *   version CMSVersion,
 *   digestAlgorithms DigestAlgorithmIdentifiers,
 *   encapContentInfo EncapsulatedContentInfo,
 *   certificates [0] IMPLICIT CertificateSet OPTIONAL,
 *   crls [1] IMPLICIT RevocationInfoChoices OPTIONAL,
 *   signerInfos SignerInfos }
 * ```
 */
export class SignedData {

  @AsnProp({ type: AsnPropTypes.Integer })
  public version: CMSVersion = 0;

  @AsnProp({ type: DigestAlgorithmIdentifier, repeated: "set" })
  public digestAlgorithms: DigestAlgorithmIdentifiers = [];

  @AsnProp({ type: EncapsulatedContentInfo })
  public encapContentInfo = new EncapsulatedContentInfo();

  @AsnProp({ type: CertificateChoices, context: 0, repeated: "set", implicit: true, optional: true })
  public certificates?: CertificateSet;

  @AsnProp({ type: RevocationInfoChoice, context: 1, implicit: true, optional: true, repeated: "set"})
  public crls?: RevocationInfoChoices;

  @AsnProp({ type: SignerInfo, repeated: "set" })
  public signerInfos: SignerInfos = [];

  constructor(params: Partial<SignedData> = {}) {
    Object.assign(this, params);
  }
}

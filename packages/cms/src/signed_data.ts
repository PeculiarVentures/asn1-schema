import { AsnProp, AsnPropTypes, AsnArray, AsnType, AsnTypeTypes } from "@peculiar/asn1-schema";
import { CertificateSet } from "./certificate_choices";
import { CMSVersion, DigestAlgorithmIdentifier } from "./types";
import { EncapsulatedContentInfo } from "./encapsulated_content_info";
import { RevocationInfoChoices } from "./revocation_info_choice";
import { SignerInfos } from "./signer_info";

/**
 * ```asn
 * DigestAlgorithmIdentifiers ::= SET OF DigestAlgorithmIdentifier
 * ```
 */
@AsnType({ type: AsnTypeTypes.Set, itemType: DigestAlgorithmIdentifier })
export class DigestAlgorithmIdentifiers extends AsnArray<DigestAlgorithmIdentifier> { 

  constructor(items?: DigestAlgorithmIdentifier[]) {
    super(items);

    // Set the prototype explicitly.
    Object.setPrototypeOf(this, DigestAlgorithmIdentifiers.prototype);
  }

}

/**
 * ```asn
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
  public version: CMSVersion = CMSVersion.v0;

  @AsnProp({ type: DigestAlgorithmIdentifiers })
  public digestAlgorithms = new DigestAlgorithmIdentifiers();

  @AsnProp({ type: EncapsulatedContentInfo })
  public encapContentInfo = new EncapsulatedContentInfo();

  @AsnProp({ type: CertificateSet, context: 0, implicit: true, optional: true })
  public certificates?: CertificateSet;

  @AsnProp({ type: RevocationInfoChoices, context: 1, implicit: true, optional: true })
  public crls?: RevocationInfoChoices;

  @AsnProp({ type: SignerInfos })
  public signerInfos = new SignerInfos();

  constructor(params: Partial<SignedData> = {}) {
    Object.assign(this, params);
  }
}

import { AsnProp, AsnPropTypes, AsnArray, AsnType, AsnTypeTypes, OctetString } from "@peculiar/asn1-schema";
import { SignerIdentifier } from "./signer_identifier";
import { CMSVersion, SignatureAlgorithmIdentifier, DigestAlgorithmIdentifier } from "./types";
import { Attribute } from "./attribute";

/**
 * ```
 * SignedAttributes ::= SET SIZE (1..MAX) OF Attribute
 * ```
 */
export type SignedAttributes = Attribute[]

/**
 * ```
 * UnsignedAttributes ::= SET SIZE (1..MAX) OF Attribute
 * ```
 */
export type UnsignedAttributes = Attribute[]

/**
 * ```
 * SignatureValue ::= OCTET STRING
 * ```
 */
export type SignatureValue = OctetString;


/**
 * ```
 * SignerInfo ::= SEQUENCE {
 *   version CMSVersion,
 *   sid SignerIdentifier,
 *   digestAlgorithm DigestAlgorithmIdentifier,
 *   signedAttrs [0] IMPLICIT SignedAttributes OPTIONAL,
 *   signatureAlgorithm SignatureAlgorithmIdentifier,
 *   signature SignatureValue,
 *   unsignedAttrs [1] IMPLICIT UnsignedAttributes OPTIONAL }
 * ```
 */
export class SignerInfo {

  @AsnProp({ type: AsnPropTypes.Integer })
  public version: CMSVersion = CMSVersion.v0;

  @AsnProp({ type: SignerIdentifier })
  public sid = new SignerIdentifier();

  @AsnProp({ type: DigestAlgorithmIdentifier })
  public digestAlgorithm = new DigestAlgorithmIdentifier();

  @AsnProp({ type: Attribute, repeated: "set", context: 0, implicit: true, optional: true })
  public signedAttrs?: SignedAttributes;

  @AsnProp({ type: SignatureAlgorithmIdentifier })
  public signatureAlgorithm = new SignatureAlgorithmIdentifier();

  @AsnProp({ type: OctetString })
  public signature: SignatureValue = new OctetString();

  @AsnProp({ type: Attribute, repeated: "set", context: 1, implicit: true, optional: true })
  unsignedAttrs?: UnsignedAttributes;

  constructor(params: Partial<SignerInfo> = {}) {
    Object.assign(this, params);
  }
}

/**
 * ```
 * SignerInfos ::= SET OF SignerInfo
 * ```
 */
@AsnType({ type: AsnTypeTypes.Set, itemType: SignerInfo })
export class SignerInfos extends AsnArray<SignerInfo> { }

import { AsnProp, AsnPropTypes } from "@peculiar/asn1-schema";
import { SubjectPublicKeyInfo, KeyIdentifier, Extensions } from "@peculiar/asn1-x509";
import { CertPathControls } from "./cert_path_controls";

/**
 * ```
 * TrustAnchorTitle ::= UTF8String (SIZE (1..64))
 * ```
 */
export type TrustAnchorTitle = string;

/**
 * ```
 * TrustAnchorInfoVersion ::= INTEGER { v1(1) }
 * ```
 */
export enum TrustAnchorInfoVersion {
  v1 = 1,
}

/**
 * ```
 * TrustAnchorInfo ::= SEQUENCE {
 *   version   TrustAnchorInfoVersion DEFAULT v1,
 *   pubKey    SubjectPublicKeyInfo,
 *   keyId     KeyIdentifier,
 *   taTitle   TrustAnchorTitle OPTIONAL,
 *   certPath  CertPathControls OPTIONAL,
 *   exts      [1] EXPLICIT Extensions {{...}}   OPTIONAL,
 *   taTitleLangTag   [2] UTF8String OPTIONAL }
 * ```
 */
export class TrustAnchorInfo {

  @AsnProp({ type: AsnPropTypes.Integer, defaultValue: TrustAnchorInfoVersion.v1 })
  public version = TrustAnchorInfoVersion.v1;

  @AsnProp({ type: SubjectPublicKeyInfo })
  public pubKey = new SubjectPublicKeyInfo();

  @AsnProp({ type: AsnPropTypes.OctetString })
  public keyId: KeyIdentifier = new ArrayBuffer(0);

  @AsnProp({ type: AsnPropTypes.Utf8String, optional: true })
  public taTitle?: TrustAnchorTitle;

  @AsnProp({ type: CertPathControls, optional: true })
  public certPath?: CertPathControls;

  @AsnProp({ type: Extensions, context: 1, optional: true })
  public exts?: Extensions;

  @AsnProp({ type: AsnPropTypes.Utf8String, context: 2, optional: true })
  public taTitleLangTag?: string;

  constructor(params: Partial<TrustAnchorInfo> = {}) {
    Object.assign(this, params);
  }
}
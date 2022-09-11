import { AsnProp, AsnPropTypes, AsnType, AsnTypeTypes, OctetString } from "@peculiar/asn1-schema";
import { ContentType, ContentEncryptionAlgorithmIdentifier } from "./types";

/**
 * ```asn
 * EncryptedContent ::= OCTET STRING
 * ```
 */
export type PrimitiveEncryptedContent = OctetString;

/**
 * ```asn
 * EncryptedContent ::= OCTET STRING
 * ```
 */
@AsnType({ type: AsnTypeTypes.Choice })
export class EncryptedContent {

  @AsnProp({ type: OctetString })
  public single?: OctetString;

  @AsnProp({ type: AsnPropTypes.Any })
  public any?: ArrayBuffer;

  constructor(params: Partial<EncryptedContent> = {}) {
    Object.assign(this, params);
  }
}

export class ImplicitEncryptedContentInfo {

  @AsnProp({ type: AsnPropTypes.ObjectIdentifier })
  public contentType: ContentType = "";

  @AsnProp({ type: ContentEncryptionAlgorithmIdentifier })
  public contentEncryptionAlgorithm = new ContentEncryptionAlgorithmIdentifier();

  @AsnProp({ type: OctetString, context: 0, implicit: true, optional: true })
  public encryptedContent?: PrimitiveEncryptedContent;

  constructor(params: Partial<ImplicitEncryptedContentInfo> = {}) {
    Object.assign(this, params);
  }
}

export class ExplicitEncryptedContentInfo {

  @AsnProp({ type: AsnPropTypes.ObjectIdentifier })
  public contentType: ContentType = "";

  @AsnProp({ type: ContentEncryptionAlgorithmIdentifier })
  public contentEncryptionAlgorithm = new ContentEncryptionAlgorithmIdentifier();

  @AsnProp({ type: EncryptedContent, context: 0, optional: true })
  public encryptedContent?: EncryptedContent;

  constructor(params: Partial<ExplicitEncryptedContentInfo> = {}) {
    Object.assign(this, params);
  }
}

/**
 * ```asn
 * EncryptedContentInfo ::= SEQUENCE {
 *  contentType ContentType,
 *  contentEncryptionAlgorithm ContentEncryptionAlgorithmIdentifier,
 *  encryptedContent [0] IMPLICIT EncryptedContent OPTIONAL }
 * ```
 */
@AsnType({ type: AsnTypeTypes.Choice })
export class EncryptedContentInfo {

  // RFC compliant
  @AsnProp({ type: ImplicitEncryptedContentInfo, optional: true })
  public implicitEncryptedContentInfo?: ImplicitEncryptedContentInfo;

  // !!! Non RFC compliant but used by modern crypto libraries
  @AsnProp({ type: ExplicitEncryptedContentInfo, optional: true })
  public explicitEncryptedContentInfo?: ExplicitEncryptedContentInfo;

  constructor(params: Partial<EncryptedContentInfo> = {}) {
    Object.assign(this, params);
  }
}

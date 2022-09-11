import { AsnProp, AsnPropTypes, AsnType, AsnTypeTypes, OctetString } from "@peculiar/asn1-schema";
import { ContentType, ContentEncryptionAlgorithmIdentifier } from "./types";

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

/**
 * ```asn
 * EncryptedContentInfo ::= SEQUENCE {
 *  contentType ContentType,
 *  contentEncryptionAlgorithm ContentEncryptionAlgorithmIdentifier,
 *  encryptedContent [0] IMPLICIT EncryptedContent OPTIONAL }
 * ```
 */
export class EncryptedContentInfo {

  @AsnProp({ type: AsnPropTypes.ObjectIdentifier })
  public contentType: ContentType = "";

  @AsnProp({ type: ContentEncryptionAlgorithmIdentifier })
  public contentEncryptionAlgorithm = new ContentEncryptionAlgorithmIdentifier();

  // !!! The RFC specifies EncryptedContent as [0] IMPLICIT but modern crypto libraries use [0] EXPLICIT
  @AsnProp({ type: EncryptedContent, context: 0, /*implicit: true,*/ optional: true })
  public encryptedContent?: EncryptedContent;

  constructor(params: Partial<EncryptedContentInfo> = {}) {
    Object.assign(this, params);
  }
}

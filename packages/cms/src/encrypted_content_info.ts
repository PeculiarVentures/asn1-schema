import { AsnProp, AsnPropTypes, OctetString } from "@peculiar/asn1-schema";
import { ContentType, ContentEncryptionAlgorithmIdentifier, EncryptedContent } from "./types";

/**
 * EncryptedContentInfo ::= SEQUENCE {
 *  contentType ContentType,
 *  contentEncryptionAlgorithm ContentEncryptionAlgorithmIdentifier,
 *  encryptedContent [0] IMPLICIT EncryptedContent OPTIONAL }
 */
export class EncryptedContentInfo {

  @AsnProp({ type: AsnPropTypes.ObjectIdentifier })
  public contentType: ContentType = "";

  @AsnProp({ type: ContentEncryptionAlgorithmIdentifier })
  public contentEncryptionAlgorithm = new ContentEncryptionAlgorithmIdentifier();

  // !!! The RFC specifies EncryptedContent as [0] IMPLICIT but modern crypto libraries use [0] EXPLICIT
  @AsnProp({ type: OctetString, context: 0, /*implicit: true,*/ optional: true })
  public encryptedContent?: EncryptedContent;

  constructor(params: Partial<EncryptedContentInfo> = {}) {
    Object.assign(this, params);
  }
}

import { AsnConstructedOctetStringConverter, AsnProp, AsnPropTypes, AsnType, AsnTypeTypes, OctetString } from "@peculiar/asn1-schema";
import { ContentType, ContentEncryptionAlgorithmIdentifier } from "./types";

/**
 * ```asn
 * EncryptedContent ::= OCTET STRING
 * ```
 */
@AsnType({ type: AsnTypeTypes.Choice })
export class EncryptedContent {

  // primitive OctetString
  @AsnProp({ type: OctetString, context: 0, implicit: true, optional: true })
  public value?: OctetString;

  // constructed OctetString (custom converter is needed to create new instances inside "repeated")
  @AsnProp({ type: OctetString, converter: AsnConstructedOctetStringConverter, context: 0, implicit: true, optional: true, repeated: "sequence" })
  public constructedValue?: OctetString[];

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

  @AsnProp({ type: EncryptedContent, optional: true })
  public encryptedContent?: EncryptedContent;

  constructor(params: Partial<EncryptedContentInfo> = {}) {
    Object.assign(this, params);
  }
}

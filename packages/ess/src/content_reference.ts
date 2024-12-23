import { ContentType } from "@peculiar/asn1-cms";
import { AsnProp, AsnPropTypes, OctetString } from "@peculiar/asn1-schema";
import { ContentIdentifier } from "./types";

/**
 * ```
 * ContentReference ::= SEQUENCE {
 *   contentType ContentType,
 *   signedContentIdentifier ContentIdentifier,
 *   originatorSignatureValue OCTET STRING }
 * ```
 */
export class ContentReference {
  @AsnProp({ type: AsnPropTypes.ObjectIdentifier })
  public contentType: ContentType = "";

  @AsnProp({ type: OctetString })
  public signedContentIdentifier: ContentIdentifier = new OctetString();

  @AsnProp({ type: OctetString })
  public originatorSignatureValue: OctetString = new OctetString();

  constructor(params: Partial<ContentReference> = {}) {
    Object.assign(this, params);
  }
}

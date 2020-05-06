import { AsnProp, AsnPropTypes } from "@peculiar/asn1-schema";
import { ContentType } from "./types";

/**
 * ```
 * ContentInfo ::= SEQUENCE {
 *    contentType ContentType,
 *    content [0] EXPLICIT ANY DEFINED BY contentType }
 * ```
 */
export class ContentInfo {

  @AsnProp({ type: AsnPropTypes.ObjectIdentifier })
  public contentType: ContentType = "";

  @AsnProp({ type: AsnPropTypes.Any, context: 0 })
  public content = new ArrayBuffer(0);

  constructor(params: Partial<ContentInfo> = {}) {
    Object.assign(this, params);
  }
}
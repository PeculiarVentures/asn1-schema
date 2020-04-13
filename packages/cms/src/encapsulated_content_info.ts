import { AsnProp, AsnPropTypes } from "@peculiar/asn1-schema";
import { ContentType } from "./types";

/**
 * ```
 * EncapsulatedContentInfo ::= SEQUENCE {
 *   eContentType ContentType,
 *   eContent [0] EXPLICIT OCTET STRING OPTIONAL }
 * ```
 */
export class EncapsulatedContentInfo {

  @AsnProp({ type: AsnPropTypes.ObjectIdentifier })
  public eContentType: ContentType = "";
  
  @AsnProp({ type: AsnPropTypes.OctetString, context: 0, optional: true })
  public eContent?: ArrayBuffer;

  constructor(params: Partial<EncapsulatedContentInfo> = {}) {
    Object.assign(this, params);
  }
}
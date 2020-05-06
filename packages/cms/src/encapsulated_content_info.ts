import { AsnProp, AsnPropTypes, OctetString } from "@peculiar/asn1-schema";
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
  
  @AsnProp({ type: OctetString, context: 0, optional: true })
  public eContent?: OctetString;

  constructor(params: Partial<EncapsulatedContentInfo> = {}) {
    Object.assign(this, params);
  }
}
import { AsnProp, AsnPropTypes, AsnType, AsnTypeTypes, OctetString } from "@peculiar/asn1-schema";
import { ContentType } from "./types";

@AsnType({ type: AsnTypeTypes.Choice })
export class EncapsulatedContent {

  @AsnProp({ type: OctetString })
  public single?: OctetString;

  @AsnProp({ type: AsnPropTypes.Any })
  public any?: ArrayBuffer;

  constructor(params: Partial<EncapsulatedContent> = {}) {
    Object.assign(this, params);
  }

}

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

  @AsnProp({ type: EncapsulatedContent, context: 0, optional: true })
  public eContent?: EncapsulatedContent;

  constructor(params: Partial<EncapsulatedContentInfo> = {}) {
    Object.assign(this, params);
  }
}
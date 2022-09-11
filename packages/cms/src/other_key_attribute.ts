import { AsnProp, AsnPropTypes } from "@peculiar/asn1-schema";

/**
 * ```asn
 * OtherKeyAttribute ::= SEQUENCE {
 *  keyAttrId OBJECT IDENTIFIER,
 *  keyAttr ANY DEFINED BY keyAttrId OPTIONAL }
 * ```
 */
export class OtherKeyAttribute {

  @AsnProp({ type: AsnPropTypes.ObjectIdentifier })
  public keyAttrId = "";

  @AsnProp({ type: AsnPropTypes.Any, optional: true })
  public keyAttr?: ArrayBuffer;

  constructor(params: Partial<OtherKeyAttribute> = {}) {
    Object.assign(this, params);
  }
}
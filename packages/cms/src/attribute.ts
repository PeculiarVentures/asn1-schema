import { AsnProp, AsnPropTypes } from "@peculiar/asn1-schema";

/**
 * ```
 * AttributeValue ::= ANY
 * ```
 */
export type AttributeValue = ArrayBuffer;

/**
 * ```
 * Attribute ::= SEQUENCE {
 *   attrType OBJECT IDENTIFIER,
 *   attrValues SET OF AttributeValue }
 * ```
 */
export class Attribute {

  @AsnProp({ type: AsnPropTypes.ObjectIdentifier })
  public attrType: string = "";

  @AsnProp({ type: Attribute, repeated: "set" })
  public attrValues: Attribute[] = [];

  constructor(params: Partial<Attribute> = {}) {
    Object.assign(this, params);
  }
}

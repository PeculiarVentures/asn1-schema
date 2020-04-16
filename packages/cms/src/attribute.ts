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

  @AsnProp({ type: AsnPropTypes.Any, repeated: "set" })
  public attrValues: AttributeValue[] = [];

  constructor(params: Partial<Attribute> = {}) {
    Object.assign(this, params);
  }
}

import { AsnProp, AsnPropTypes } from "@peculiar/asn1-schema";

/**
 * ```asn
 * AttributeValue ::= ANY
 * ```
 */
export type AttributeValue = ArrayBuffer;

/**
 * ```asn
 * Attribute ::= SEQUENCE {
 *   attrType OBJECT IDENTIFIER,
 *   attrValues SET OF AttributeValue }
 * ```
 */
export class Attribute {
  @AsnProp({ type: AsnPropTypes.ObjectIdentifier })
  public attrType = "";

  @AsnProp({ type: AsnPropTypes.Any, repeated: "set" })
  public attrValues: AttributeValue[] = [];

  constructor(params: Partial<Attribute> = {}) {
    Object.assign(this, params);
  }
}

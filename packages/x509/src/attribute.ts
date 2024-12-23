import { AsnProp, AsnPropTypes } from "@peculiar/asn1-schema";

/**
 * ```asn1
 * Attribute   ::= SEQUENCE {
 *      type             AttributeType,
 *      values    SET OF AttributeValue }
 *         -- at least one value is required
 * ```
 */
export class Attribute {
  @AsnProp({ type: AsnPropTypes.ObjectIdentifier })
  public type = "";

  @AsnProp({ type: AsnPropTypes.Any, repeated: "set" })
  public values: ArrayBuffer[] = [];

  constructor(params: Partial<Attribute> = {}) {
    Object.assign(this, params);
  }
}

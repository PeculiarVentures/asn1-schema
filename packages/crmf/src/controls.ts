import { AsnArray, AsnType, AsnTypeTypes } from "@peculiar/asn1-schema";
import { AttributeTypeAndValue } from "@peculiar/asn1-x509";

/**
 * ```asn1
 * Controls  ::= SEQUENCE SIZE(1..MAX) OF AttributeTypeAndValue
 * ```
 */
@AsnType({ type: AsnTypeTypes.Sequence, itemType: AttributeTypeAndValue })
export class Controls extends AsnArray<AttributeTypeAndValue> {
  constructor(items?: AttributeTypeAndValue[]) {
    super(items);

    // Set the prototype explicitly.
    Object.setPrototypeOf(this, Controls.prototype);
  }
}

import { AsnArray, AsnType, AsnTypeTypes } from "@peculiar/asn1-schema";
import { Attribute } from "@peculiar/asn1-x509";

/**
 * ```
 * Attributes { ATTRIBUTE:IOSet } ::= SET OF Attribute{{ IOSet }}
 * ```
 */
@AsnType({ type: AsnTypeTypes.Sequence, itemType: Attribute })
export class Attributes extends AsnArray<Attribute> {

  constructor(items?: Attribute[]) {
    super(items);

    // Set the prototype explicitly.
    Object.setPrototypeOf(this, Attributes.prototype);
  }

}

import { AsnType, AsnTypeTypes } from "@peculiar/asn1-schema";
import { GeneralName } from "./general_name";
import { AsnArray } from "@peculiar/asn1-schema";

/**
 * ```
 * GeneralNames ::= SEQUENCE SIZE (1..MAX) OF GeneralName
 * ```
 */
@AsnType({ type: AsnTypeTypes.Sequence, itemType: GeneralName })
export class GeneralNames extends AsnArray<GeneralName> {

  constructor(items?: GeneralName[]) {
    super(items);

    // Set the prototype explicitly.
    Object.setPrototypeOf(this, GeneralNames.prototype);
  }

}
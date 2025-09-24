import { AsnType, AsnTypeTypes, AsnArray } from "@peculiar/asn1-schema";
import { GeneralName } from "./general_name";

/**
 * ```asn1
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

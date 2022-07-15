import { AsnArray, AsnType, AsnTypeTypes } from "@peculiar/asn1-schema";
import { Attribute } from "../attribute";
import { id_ce } from "../object_identifiers";

/**
 * ```
 * id-ce-subjectDirectoryAttributes OBJECT IDENTIFIER ::=  { id-ce 9 }
 * ```
 */
export const id_ce_subjectDirectoryAttributes = `${id_ce}.9`;

/**
 * ```
 * SubjectDirectoryAttributes ::= SEQUENCE SIZE (1..MAX) OF Attribute
 * ```
 */
@AsnType({ type: AsnTypeTypes.Sequence, itemType: Attribute })
export class SubjectDirectoryAttributes extends AsnArray<Attribute> {

  constructor(items?: Attribute[]) {
    super(items);

    // Set the prototype explicitly.
    Object.setPrototypeOf(this, SubjectDirectoryAttributes.prototype);
  }

}

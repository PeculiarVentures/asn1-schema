import { AsnArray, AsnType, AsnTypeTypes } from "@peculiar/asn1-schema";
import { id_pe } from "../object_identifiers";
import { AccessDescription } from "./authority_information_access";

/**
 * ```
 * id-pe-subjectInfoAccess OBJECT IDENTIFIER ::= { id-pe 11 }
 * ```
 */
export const id_pe_subjectInfoAccess = `${id_pe}.11`;

/**
 * ```
 * SubjectInfoAccessSyntax  ::=
 *         SEQUENCE SIZE (1..MAX) OF AccessDescription
 * ```
 */
@AsnType({ type: AsnTypeTypes.Sequence, itemType: AccessDescription })
export class SubjectInfoAccessSyntax extends AsnArray<AccessDescription> {

  constructor(items?: AccessDescription[]) {
    super(items);

    // Set the prototype explicitly.
    Object.setPrototypeOf(this, SubjectInfoAccessSyntax.prototype);
  }

}

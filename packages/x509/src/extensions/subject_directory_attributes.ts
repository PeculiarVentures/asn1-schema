import { AsnProp } from "@peculiar/asn1-schema";
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
export class SubjectDirectoryAttributes {

  @AsnProp({ type: Attribute, repeated: true })
  public items: Attribute[];

  constructor(items: Attribute[] = []) {
    this.items = items;
  }
}

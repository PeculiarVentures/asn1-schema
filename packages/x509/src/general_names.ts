import { AsnProp } from "@peculiar/asn1-schema";
import { GeneralName } from "./general_name";

/**
 * ```
 * GeneralNames ::= SEQUENCE SIZE (1..MAX) OF GeneralName
 * ```
 */
export class GeneralNames {

  @AsnProp({ type: GeneralName, repeated: "sequence" })
  public items: GeneralName[];

  constructor(items: GeneralName[] = []) {
    this.items = items;
  }
}
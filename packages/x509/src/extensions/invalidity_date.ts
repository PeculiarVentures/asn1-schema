import { AsnProp, AsnPropTypes, AsnType, AsnTypeTypes } from "@peculiar/asn1-schema";
import { id_ce } from "../object_identifiers";

/**
 * ```
 * id-ce-invalidityDate OBJECT IDENTIFIER ::= { id-ce 24 }
 * ```
 */
export const id_ce_invalidityDate = `${id_ce}.24`;

/**
 * ```
 * InvalidityDate ::=  GeneralizedTime
 * ```
 */
@AsnType({ type: AsnTypeTypes.Choice })
export class InvalidityDate {

  @AsnProp({ type: AsnPropTypes.GeneralizedTime })
  public value = new Date();

  constructor(value?: Date) {
    if (value) {
      this.value = value;
    }
  }
}

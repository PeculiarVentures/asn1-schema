import { AsnProp, AsnPropTypes, AsnType, AsnTypeTypes } from "@peculiar/asn1-schema";
import { id_ce } from "../object_identifiers";

/**
 * ```
 * id-ce-cRLNumber OBJECT IDENTIFIER ::= { id-ce 20 }
 * ```
 */
export const id_ce_cRLNumber = `${id_ce}.20`;

/**
 * ```
 * CRLNumber ::= INTEGER (0..MAX)
 * ```
 */
@AsnType({ type: AsnTypeTypes.Choice })
export class CRLNumber {

  @AsnProp({ type: AsnPropTypes.Integer })
  public value: number;

  public constructor(value = 0) {
    this.value = value;
  }

}

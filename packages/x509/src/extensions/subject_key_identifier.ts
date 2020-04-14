import { AsnProp, AsnPropTypes, AsnType, AsnTypeTypes } from "@peculiar/asn1-schema";
import { id_ce } from "../object_identifiers";

/**
 * ```
 * id-ce-subjectKeyIdentifier OBJECT IDENTIFIER ::=  { id-ce 14 }
 * ```
 */
export const id_ce_subjectKeyIdentifier = `${id_ce}.14`;

/**
 * ```
 * SubjectKeyIdentifier ::= KeyIdentifier
 * ```
 */
@AsnType({ type: AsnTypeTypes.Choice })
export class SubjectKeyIdentifier {

  @AsnProp({ type: AsnPropTypes.OctetString })
  public keyIdentifier: ArrayBuffer = new ArrayBuffer(0);

  constructor(keyIdentifier?: ArrayBuffer) {
    if (keyIdentifier) {
      this.keyIdentifier = keyIdentifier;
    }
  }

}

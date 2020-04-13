import { AsnProp, AsnType, AsnTypeTypes, AsnPropTypes } from "@peculiar/asn1-schema";

// re-ocsp-extended-revoke EXTENSION ::= { SYNTAX NULL IDENTIFIED BY
//                                         id-pkix-ocsp-extended-revoke }

/**
 * ```
 * ExtendedRevoke ::= NULL
 * ```
 */
@AsnType({ type: AsnTypeTypes.Choice })
export class ExtendedRevoke {

  @AsnProp({ type: AsnPropTypes.Null })
  public value: null;

  constructor(value = null) {
    this.value = value;
  }
}
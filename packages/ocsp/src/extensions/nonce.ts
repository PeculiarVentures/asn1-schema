import { AsnType, AsnTypeTypes, AsnProp, AsnPropTypes } from "@peculiar/asn1-schema";

// re-ocsp-nonce EXTENSION ::= { SYNTAX OCTET STRING IDENTIFIED
//   BY id-pkix-ocsp-nonce }

/**
 * ```
 * Nonce ::= OCTET STRING
 * ```
 */
@AsnType({ type: AsnTypeTypes.Choice })
export class Nonce {

  @AsnProp({ type: AsnPropTypes.OctetString })
  public value = new ArrayBuffer(0);

  constructor(value?: ArrayBuffer) {
    if (value) {
      this.value = value;
    }
  }
}
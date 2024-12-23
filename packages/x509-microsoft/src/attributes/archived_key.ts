import { AsnProp, AsnPropTypes, AsnType, AsnTypeTypes } from "@peculiar/asn1-schema";

export const id_archivedKey = "1.3.6.1.4.1.311.21.13";

/**
 * The format MUST be a CMC certificate request (as specified in [RFC2797]), ASN.1 DER encoded, as specified in [X690]
 */
@AsnType({ type: AsnTypeTypes.Choice })
export class ArchivedKey {
  @AsnProp({ type: AsnPropTypes.Any })
  public value: ArrayBuffer;

  constructor(value = new ArrayBuffer(0)) {
    this.value = value;
  }
}

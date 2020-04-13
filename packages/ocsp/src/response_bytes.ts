import { AsnProp, AsnPropTypes } from "@peculiar/asn1-schema";

/**
 * ```
 * ResponseBytes ::= SEQUENCE {
 *   responseType            OBJECT IDENTIFIER,
 *   response                OCTET STRING }
 * ```
 */
export class ResponseBytes {

  @AsnProp({ type: AsnPropTypes.ObjectIdentifier })
  public responseType = "";

  @AsnProp({ type: AsnPropTypes.OctetString })
  public response = new ArrayBuffer(0);

  constructor(params: Partial<ResponseBytes> = {}) {
    Object.assign(this, params);
  }
}
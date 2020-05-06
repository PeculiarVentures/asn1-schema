import { AsnProp, AsnPropTypes, OctetString } from "@peculiar/asn1-schema";

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

  @AsnProp({ type: OctetString })
  public response = new OctetString();

  constructor(params: Partial<ResponseBytes> = {}) {
    Object.assign(this, params);
  }
}
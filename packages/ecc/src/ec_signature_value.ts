import { AsnProp, AsnPropTypes, AsnIntegerArrayBufferConverter } from "@peculiar/asn1-schema";

/**
 * ```asn1
 * ECDSA-Sig-Value ::= SEQUENCE {
 *   r  INTEGER,
 *   s  INTEGER
 * }
 * ```
 */
export class ECDSASigValue {
  @AsnProp({ type: AsnPropTypes.Integer, converter: AsnIntegerArrayBufferConverter })
  public r = new ArrayBuffer(0);

  @AsnProp({ type: AsnPropTypes.Integer, converter: AsnIntegerArrayBufferConverter })
  public s = new ArrayBuffer(0);

  constructor(params: Partial<ECDSASigValue> = {}) {
    Object.assign(this, params);
  }
}

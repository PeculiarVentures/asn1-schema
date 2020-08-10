import { AsnProp, AsnPropTypes, AsnIntegerArrayBufferConverter, AsnArray, AsnType, AsnTypeTypes } from "@peculiar/asn1-schema";

/**
 * ```
 * OtherPrimeInfo ::= SEQUENCE {
 *     prime             INTEGER,  -- ri
 *     exponent          INTEGER,  -- di
 *     coefficient       INTEGER   -- ti
 * }
 * ```
 */
export class OtherPrimeInfo {

  @AsnProp({ type: AsnPropTypes.Integer, converter: AsnIntegerArrayBufferConverter })
  public prime = new ArrayBuffer(0);

  @AsnProp({ type: AsnPropTypes.Integer, converter: AsnIntegerArrayBufferConverter })
  public exponent = new ArrayBuffer(0);

  @AsnProp({ type: AsnPropTypes.Integer, converter: AsnIntegerArrayBufferConverter })
  public coefficient = new ArrayBuffer(0);

  constructor(params: Partial<OtherPrimeInfo> = {}) {
    Object.assign(this, params);
  }
}

/**
 * ```
 * OtherPrimeInfos ::= SEQUENCE SIZE(1..MAX) OF OtherPrimeInfo
 * ```
 */
@AsnType({ type: AsnTypeTypes.Sequence, itemType: OtherPrimeInfo })
export class OtherPrimeInfos extends AsnArray<OtherPrimeInfo> {

  constructor(items?: OtherPrimeInfo[]) {
    super(items);

    // Set the prototype explicitly.
    Object.setPrototypeOf(this, OtherPrimeInfos.prototype);
  }

}

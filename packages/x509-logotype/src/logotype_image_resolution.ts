import { AsnProp, AsnPropTypes, AsnType, AsnTypeTypes } from "@peculiar/asn1-schema";

/**
 * ```
 * LogotypeImageResolution ::= CHOICE {
 *   numBits         [1] INTEGER,   -- Resolution in bits
 *   tableSize       [2] INTEGER }  -- Number of colors or grey tones
 * ```
 */
@AsnType({ type: AsnTypeTypes.Choice })
export class LogotypeImageResolution {
  /**
   * Resolution in bits
   */
  @AsnProp({ type: AsnPropTypes.Integer, context: 1, implicit: true })
  public numBits?: number;

  /**
   * Number of colors or grey tones
   */
  @AsnProp({ type: AsnPropTypes.Integer, context: 2, implicit: true })
  public tableSize?: number;

  constructor(params: Partial<LogotypeImageResolution> = {}) {
    Object.assign(this, params);
  }
}

import { AsnProp, AsnPropTypes } from "@peculiar/asn1-schema";

/**
 * ```
 * Accuracy ::= SEQUENCE {
 *   seconds        INTEGER           OPTIONAL,
 *   millis     [0] INTEGER  (1..999) OPTIONAL,
 *   micros     [1] INTEGER  (1..999) OPTIONAL  }
 * ```
 */
export class Accuracy {
  @AsnProp({ type: AsnPropTypes.Integer, optional: true })
  public seconds = 0;

  @AsnProp({ type: AsnPropTypes.Integer, context: 0, implicit: true, optional: true })
  public millis?: number;

  @AsnProp({ type: AsnPropTypes.Integer, context: 1, implicit: true, optional: true })
  public micros?: number;

  constructor(params: Partial<Accuracy> = {}) {
    Object.assign(this, params);
  }
}

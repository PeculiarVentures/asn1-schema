import { AsnProp, AsnType, AsnTypeTypes } from "@peculiar/asn1-schema";
import { Time } from "@peculiar/asn1-x509";

/**
 * ```asn1
 * OptionalValidity ::= SEQUENCE {
 *  notBefore  [0] Time OPTIONAL,
 *  notAfter   [1] Time OPTIONAL } -- at least one MUST be present
 * ```
 */
@AsnType({ type: AsnTypeTypes.Sequence })
export class OptionalValidity {
  @AsnProp({ type: Time, context: 0, optional: true, implicit: false })
  public notBefore?: Time;

  @AsnProp({ type: Time, context: 1, optional: true, implicit: false })
  public notAfter?: Time;

  constructor(params: Partial<OptionalValidity> = {}) {
    Object.assign(this, params);
  }
}

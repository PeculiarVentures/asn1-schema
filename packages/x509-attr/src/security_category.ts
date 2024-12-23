import { AsnProp, AsnPropTypes } from "@peculiar/asn1-schema";

/**
 * ```asn1
 * SecurityCategory ::= SEQUENCE {
 *      type      [0]  IMPLICIT OBJECT IDENTIFIER,
 *      value     [1]  ANY DEFINED BY type
 * }
 * ```
 */
export class SecurityCategory {
  @AsnProp({ type: AsnPropTypes.ObjectIdentifier, implicit: true, context: 0 })
  public type = "";

  @AsnProp({ type: AsnPropTypes.Any, implicit: true, context: 1 })
  public value = new ArrayBuffer(0);

  constructor(params: Partial<SecurityCategory> = {}) {
    Object.assign(this, params);
  }
}

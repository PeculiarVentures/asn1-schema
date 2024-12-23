import { AsnProp, AsnPropTypes } from "@peculiar/asn1-schema";

/**
 * ```asn1
 * SecretBag ::= SEQUENCE {
 *   secretTypeId  BAG-TYPE.&id ({SecretTypes}),
 *   secretValue   [0] EXPLICIT BAG-TYPE.&Type ({SecretTypes}
 *                                              {@secretTypeId})
 * }
 * ```
 */
export class SecretBag {
  @AsnProp({ type: AsnPropTypes.ObjectIdentifier })
  public secretTypeId = "";

  @AsnProp({ type: AsnPropTypes.Any, context: 0 })
  public secretValue = new ArrayBuffer(0);

  constructor(params: Partial<SecretBag> = {}) {
    Object.assign(this, params);
  }
}

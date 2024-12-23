import { AsnProp, AsnPropTypes } from "@peculiar/asn1-schema";

export const id_enrollmentCSPProvider = "1.3.6.1.4.1.311.13.2.2";

/**
 * ```asn1
 * CSPProvider ::= SEQUENCE {
 *   keySpec_INTEGER,
 *   cspName_BMPSTRING,
 *   signature_BITSTRING
 * }
 * ```
 */
export class CSPProvider {
  @AsnProp({ type: AsnPropTypes.Integer })
  public keySpec = 0;

  @AsnProp({ type: AsnPropTypes.BmpString })
  public cspName = "";

  @AsnProp({ type: AsnPropTypes.BitString })
  public signature = new ArrayBuffer(0);

  constructor(params: Partial<CSPProvider> = {}) {
    Object.assign(this, params);
  }
}

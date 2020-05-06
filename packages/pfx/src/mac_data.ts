import { DigestInfo } from "@peculiar/asn1-rsa";
import { AsnProp, AsnPropTypes, OctetString } from "@peculiar/asn1-schema";

/**
 * ```
 * MacData ::= SEQUENCE {
 *   mac        DigestInfo,
 *   macSalt    OCTET STRING,
 *   iterations INTEGER DEFAULT 1
 *   -- Note: The default is for historical reasons and its use is
 *   -- deprecated.
 * }
 * ```
 */
export class MacData {

  @AsnProp({ type: DigestInfo })
  public mac = new DigestInfo();

  @AsnProp({ type: OctetString })
  public macSalt = new OctetString();

  @AsnProp({ type: AsnPropTypes.Integer, defaultValue: 1 })
  public iterations = 1;

  constructor(params: Partial<MacData> = {}) {
    Object.assign(this, params);
  }
}
import { AsnProp, OctetString } from "@peculiar/asn1-schema";
import { GeneralName } from "@peculiar/asn1-x509";

/**
 * ```
 * SvceAuthInfo ::=    SEQUENCE {
 *      service       GeneralName,
 *      ident         GeneralName,
 *      authInfo      OCTET STRING OPTIONAL
 * }
 * ```
 */
export class SvceAuthInfo {

  @AsnProp({ type: GeneralName })
  public service = new GeneralName();

  @AsnProp({ type: GeneralName })
  public ident = new GeneralName();

  @AsnProp({ type: OctetString, optional: true })
  public authInfo?: OctetString;

  constructor(params: Partial<SvceAuthInfo> = {}) {
    Object.assign(this, params);
  }
}

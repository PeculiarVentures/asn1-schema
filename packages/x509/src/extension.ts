import { AsnProp, AsnPropTypes } from "@peculiar/asn1-schema";

/**
 * ```
 * Extension  ::=  SEQUENCE  {
 *   extnID      OBJECT IDENTIFIER,
 *   critical    BOOLEAN DEFAULT FALSE,
 *   extnValue   OCTET STRING
 *               -- contains the DER encoding of an ASN.1 value
 *               -- corresponding to the extension type identified
 *               -- by extnID
 *   }
 * ```
 */
export class Extension {

  public static CRITICAL = false;

  @AsnProp({ type: AsnPropTypes.ObjectIdentifier })
  public extnID: string = "";

  @AsnProp({
    type: AsnPropTypes.Boolean,
    defaultValue: Extension.CRITICAL,
  })
  public critical = Extension.CRITICAL;

  @AsnProp({ type: AsnPropTypes.OctetString })
  public extnValue: ArrayBuffer = new ArrayBuffer(0);

  constructor(params: Partial<Extension> = {}) {
    Object.assign(this, params);
  }

}

/**
 * ```
 * Extensions  ::=  SEQUENCE SIZE (1..MAX) OF Extension
 * ```
 */
export type Extensions = Extension[];

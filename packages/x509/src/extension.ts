import { AsnProp, AsnPropTypes, AsnArray, AsnType, AsnTypeTypes, OctetString } from "@peculiar/asn1-schema";

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
  public extnID = "";

  @AsnProp({
    type: AsnPropTypes.Boolean,
    defaultValue: Extension.CRITICAL,
  })
  public critical = Extension.CRITICAL;

  @AsnProp({ type: OctetString })
  public extnValue = new OctetString();

  constructor(params: Partial<Extension> = {}) {
    Object.assign(this, params);
  }

}

/**
 * ```
 * Extensions  ::=  SEQUENCE SIZE (1..MAX) OF Extension
 * ```
 */
@AsnType({ type: AsnTypeTypes.Sequence, itemType: Extension })
export class Extensions extends AsnArray<Extension>{

  constructor(items?: Extension[]) {
    super(items);

    // Set the prototype explicitly.
    Object.setPrototypeOf(this, Extensions.prototype);
  }

}

import { AsnType, AsnTypeTypes, AsnProp, AsnPropTypes } from "@peculiar/asn1-schema";

/**
 * szOID_OS_VERSION
 */
export const id_osVersion = "1.3.6.1.4.1.311.13.2.3";

/**
 * ```asn1
 * AnyString ::= CHOICE {
 *   numericString   NUMERICSTRING,   -- tag 0x12 (18)
 *   printableString PRINTABLESTRING, -- tag 0x13 (19)
 *   teletexString   TELETEXSTRING,   -- tag 0x14 (20)
 *   videotexString  VIDEOTEXSTRING,  -- tag 0x15 (21)
 *   ia5String       IA5STRING,       -- tag 0x16 (22)
 *   graphicString   GRAPHICSTRING,   -- tag 0x19 (25)
 *   visibleString   VISIBLESTRING,   -- tag 0x1A (26)
 *   generalString   GENERALSTRING,   -- tag 0x1B (27)
 *   universalString UNIVERSALSTRING, -- tag 0x1C (28)
 *   bmpString       BMPSTRING,       -- tag 0x1E (30)
 * } --#public
 * ```
 */
@AsnType({ type: AsnTypeTypes.Choice })
export class AnyString {
  @AsnProp({ type: AsnPropTypes.NumericString })
  public numericString?: string;

  @AsnProp({ type: AsnPropTypes.PrintableString })
  public printableString?: string;

  @AsnProp({ type: AsnPropTypes.TeletexString })
  public teletexString?: string;

  @AsnProp({ type: AsnPropTypes.VideotexString })
  public videotexString?: string;

  @AsnProp({ type: AsnPropTypes.IA5String })
  public ia5String?: string;

  @AsnProp({ type: AsnPropTypes.GraphicString })
  public graphicString?: string;

  @AsnProp({ type: AsnPropTypes.VisibleString })
  public visibleString?: string;

  @AsnProp({ type: AsnPropTypes.GeneralString })
  public generalString?: string;

  @AsnProp({ type: AsnPropTypes.UniversalString })
  public universalString?: string;

  @AsnProp({ type: AsnPropTypes.BmpString })
  public bmpString?: string;

  constructor(params: Partial<AnyString> = {}) {
    Object.assign(this, params);
  }
}

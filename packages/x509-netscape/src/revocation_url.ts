import { AsnType, AsnTypeTypes, AsnPropTypes, AsnProp } from "@peculiar/asn1-schema";
import { id_netscapeCertExtension } from "./object_identifiers";

/**
 * ```asn1
 * netscape-revocation-url OBJECT IDENTIFIER ::= { netscape-cert-extension 3 }
 * ```
 */
export const id_netscapeRevocationUrl = `${id_netscapeCertExtension}.3`;

/**
 * ```asn1
 * NetscapeRevocationUrl ::= IA5String
 * ```
 */
@AsnType({ type: AsnTypeTypes.Choice })
export class NetscapeRevocationUrl {
  @AsnProp({ type: AsnPropTypes.IA5String })
  public value = "";

  constructor(value?: string) {
    if (value) {
      this.value = value;
    }
  }
}

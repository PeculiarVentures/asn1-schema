import { id_netscapeCertExtension } from "./object_identifiers";
import { AsnType, AsnTypeTypes, AsnPropTypes, AsnProp } from "@peculiar/asn1-schema";

/**
 * ```asn1
 * netscape-cert-renewal-url OBJECT IDENTIFIER ::= { netscape-cert-extension 7 }
 * ```
 */
export const id_netscapeCertRenewUrl = `${id_netscapeCertExtension}.7`;

/**
 * ```asn1
 * NetscapeCertRenewUrl ::= IA5String
 * ```
 */
@AsnType({ type: AsnTypeTypes.Choice })
export class NetscapeCertRenewUrl {
  @AsnProp({ type: AsnPropTypes.IA5String })
  public value = "";

  constructor(value?: string) {
    if (value) {
      this.value = value;
    }
  }
}

import { id_netscapeCertExtension } from "./object_identifiers";
import { AsnType, AsnTypeTypes, AsnPropTypes, AsnProp } from "@peculiar/asn1-schema";

/**
 * ```
 * netscape-ssl-server-name OBJECT IDENTIFIER ::= { netscape-cert-extension 12 }
 * ```
 */
export const id_netscapeSSLServerName = `${id_netscapeCertExtension}.12`;

/**
 * ```
 * NetscapeSSLServerName ::= IA5String
 * ```
 */
@AsnType({ type: AsnTypeTypes.Choice })
export class NetscapeSSLServerName {

  @AsnProp({ type: AsnPropTypes.IA5String })
  public value = "";

  constructor(value?: string) {
    if (value) {
      this.value = value;
    }
  }

}

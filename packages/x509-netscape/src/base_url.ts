import { id_netscapeCertExtension } from "./object_identifiers";
import { AsnType, AsnTypeTypes, AsnPropTypes, AsnProp } from "@peculiar/asn1-schema";

/**
 * ```
 * netscape-base-url OBJECT IDENTIFIER ::= { netscape-cert-extension 2 }
 * ```
 */
export const id_netscapeBaseUrl = `${id_netscapeCertExtension}.2`;

/**
 * ```
 * NetscapeBaseUrl ::= IA5String
 * ```
 */
@AsnType({ type: AsnTypeTypes.Choice })
export class NetscapeBaseUrl {

  @AsnProp({ type: AsnPropTypes.IA5String })
  public value = "";

  constructor(value?: string) {
    if (value) {
      this.value = value;
    }
  }

}

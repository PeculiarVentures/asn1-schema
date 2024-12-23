import { id_netscapeCertExtension } from "./object_identifiers";
import { AsnType, AsnTypeTypes, AsnPropTypes, AsnProp } from "@peculiar/asn1-schema";

/**
 * ```asn1
 * netscape-ca-policy-url OBJECT IDENTIFIER ::= { netscape-cert-extension 8 }
 * ```
 */
export const id_netscapeCaPolicyUrl = `${id_netscapeCertExtension}.8`;

/**
 * ```asn1
 * NetscapeCaPolicyUrl ::= IA5String
 * ```
 */
@AsnType({ type: AsnTypeTypes.Choice })
export class NetscapeCaPolicyUrl {
  @AsnProp({ type: AsnPropTypes.IA5String })
  public value = "";

  constructor(value?: string) {
    if (value) {
      this.value = value;
    }
  }
}

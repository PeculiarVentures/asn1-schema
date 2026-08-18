import { AsnType, AsnTypeTypes, AsnPropTypes, AsnProp } from "@peculiar/asn1-schema";
import { id_netscapeCertExtension } from "./object_identifiers";

/**
 * ```asn1
 * netscape-ca-revocation-url OBJECT IDENTIFIER ::= { netscape-cert-extension 4 }
 * ```
 */
export const id_netscapeCaRevocationUrl = `${id_netscapeCertExtension}.4`;

/**
 * ```asn1
 * NetscapeCaRevocationUrl ::= IA5String
 * ```
 */
@AsnType({ type: AsnTypeTypes.Choice })
export class NetscapeCaRevocationUrl {
  @AsnProp({ type: AsnPropTypes.IA5String })
  public value = "";

  constructor(value?: string) {
    if (value) {
      this.value = value;
    }
  }
}

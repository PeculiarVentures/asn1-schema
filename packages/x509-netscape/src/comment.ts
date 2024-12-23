import { id_netscapeCertExtension } from "./object_identifiers";
import { AsnType, AsnTypeTypes, AsnPropTypes, AsnProp } from "@peculiar/asn1-schema";

/**
 * ```asn1
 * netscape-comment OBJECT IDENTIFIER ::= { netscape-cert-extension 13 }
 * ```
 */
export const id_netscapeComment = `${id_netscapeCertExtension}.13`;

/**
 * ```asn1
 * NetscapeComment ::= IA5String
 * ```
 */
@AsnType({ type: AsnTypeTypes.Choice })
export class NetscapeComment {
  @AsnProp({ type: AsnPropTypes.IA5String })
  public value = "";

  constructor(value?: string) {
    if (value) {
      this.value = value;
    }
  }
}

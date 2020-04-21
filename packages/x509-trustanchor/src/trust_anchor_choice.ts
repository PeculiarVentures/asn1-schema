import { AsnType, AsnTypeTypes, AsnProp } from "@peculiar/asn1-schema";
import { Certificate, TBSCertificate } from "@peculiar/asn1-x509";
import { TrustAnchorInfo } from "./trust_anchor_info";

/**
 * ```
 * TrustAnchorChoice ::= CHOICE {
 *   certificate  Certificate,
 *   tbsCert      [1] EXPLICIT TBSCertificate,
 *   taInfo       [2] EXPLICIT TrustAnchorInfo }
 * ```
 */
@AsnType({ type: AsnTypeTypes.Choice })
export class TrustAnchorChoice {

  @AsnProp({ type: Certificate })
  public certificate?: Certificate;

  @AsnProp({ type: TBSCertificate, context: 1 })
  public tbsCert?: TBSCertificate;

  @AsnProp({ type: TrustAnchorInfo, context: 2 })
  public taInfo?: TrustAnchorInfo;

  constructor(params?: Certificate | TBSCertificate | TrustAnchorInfo) {
    if (params) {
      if (params instanceof Certificate) {
        this.certificate = params;
      } else if (params instanceof TBSCertificate) {
        this.tbsCert = params;
      } else if (params instanceof TrustAnchorInfo) {
        this.taInfo = params;
      } else {
        throw new Error("Unsupported params for TrustAnchorChoice");
      }
    }
  }
}
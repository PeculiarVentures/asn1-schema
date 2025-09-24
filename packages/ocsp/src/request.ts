import { AsnProp } from "@peculiar/asn1-schema";
import { Extensions, Extension } from "@peculiar/asn1-x509";
import { CertID } from "./cert_id";

/**
 * ```asn1
 * Request         ::=     SEQUENCE {
 *   reqCert                     CertID,
 *   singleRequestExtensions     [0] EXPLICIT Extensions OPTIONAL }
 * ```
 */
export class Request {
  @AsnProp({ type: CertID })
  public reqCert = new CertID();

  @AsnProp({ type: Extension, repeated: "sequence", optional: true })
  public singleRequestExtensions?: Extensions;

  constructor(params: Partial<Request> = {}) {
    Object.assign(this, params);
  }
}

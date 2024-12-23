import { AsnProp } from "@peculiar/asn1-schema";
import { CertID } from "./cert_id";
import { Extensions, Extension } from "@peculiar/asn1-x509";

/**
 * ```
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

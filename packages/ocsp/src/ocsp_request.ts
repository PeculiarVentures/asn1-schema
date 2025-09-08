import { AsnProp } from "@peculiar/asn1-schema";
import { Signature } from "./signature";
import { TBSRequest } from "./tbs_request";

/**
 * ```asn1
 * OCSPRequest     ::=     SEQUENCE {
 *   tbsRequest                  TBSRequest,
 *   optionalSignature   [0]     EXPLICIT Signature OPTIONAL }
 * ```
 */
export class OCSPRequest {
  @AsnProp({ type: TBSRequest, raw: true })
  public tbsRequest = new TBSRequest();

  public tbsRequestRaw?: ArrayBuffer;

  @AsnProp({ type: Signature, optional: true, context: 0 })
  public optionalSignature?: Signature;

  constructor(params: Partial<OCSPRequest> = {}) {
    Object.assign(this, params);
  }
}

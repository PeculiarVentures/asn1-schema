import { AsnProp } from "@peculiar/asn1-schema";
import { Signature } from "./signature";
import { TBSRequest } from "./tbs_request";

/**
 * ```
 * OCSPRequest     ::=     SEQUENCE {
 *   tbsRequest                  TBSRequest,
 *   optionalSignature   [0]     EXPLICIT Signature OPTIONAL }
 * ```
 */
export class OCSPRequest {
  
  @AsnProp({type: TBSRequest})
  public tbsRequest = new TBSRequest();
  
  @AsnProp({type: Signature, optional: true})
  public optionalSignature?: Signature;

  constructor(params: Partial<OCSPRequest> = {}) {
    Object.assign(this, params);
  }
}

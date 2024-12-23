import { AsnProp, AsnPropTypes } from "@peculiar/asn1-schema";
import { OCSPResponseStatus } from "./ocsp_response_status";
import { ResponseBytes } from "./response_bytes";

/**
 * ```
 * OCSPResponse ::= SEQUENCE {
 *   responseStatus          OCSPResponseStatus,
 *   responseBytes       [0] EXPLICIT ResponseBytes OPTIONAL }
 * ```
 */
export class OCSPResponse {
  @AsnProp({ type: AsnPropTypes.Enumerated })
  public responseStatus = OCSPResponseStatus.successful;

  @AsnProp({ type: ResponseBytes, context: 0, optional: true })
  public responseBytes?: ResponseBytes;

  constructor(params: Partial<OCSPResponse> = {}) {
    Object.assign(this, params);
  }
}

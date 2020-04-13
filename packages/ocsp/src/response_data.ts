import { AsnProp, AsnPropTypes } from "@peculiar/asn1-schema";
import { Extension } from "@peculiar/asn1-x509";
import { ResponderID } from "./responder_id";
import { SingleResponse } from "./single_response";

/**
 * ```
 * ResponseData ::= SEQUENCE {
 *   version             [0] EXPLICIT Version DEFAULT v1,
 *   responderID             ResponderID,
 *   producedAt              GeneralizedTime,
 *   responses               SEQUENCE OF SingleResponse,
 *   responseExtensions  [1] EXPLICIT Extensions OPTIONAL }
 * ```
 */
export class ResponseData {

  @AsnProp({ type: AsnPropTypes.Integer, context: 0, defaultValue: 0 })
  public version = 0;

  @AsnProp({ type: ResponderID })
  public responderID = new ResponderID();

  @AsnProp({ type: AsnPropTypes.GeneralizedTime })
  public producedAt = new Date();

  @AsnProp({ type: SingleResponse, repeated: "sequence" })
  public responses: SingleResponse[] = [];

  @AsnProp({ type: Extension, repeated: "sequence", context: 0, optional: true })
  public responseExtensions?: Extension[];

  constructor(params: Partial<ResponseData> = {}) {
    Object.assign(this, params);
  }
}
import { AsnProp, AsnPropTypes } from "@peculiar/asn1-schema";
import { GeneralName, Extensions, Extension } from "@peculiar/asn1-x509";
import { Request } from "./request";

/**
 * ```
 * TBSRequest      ::=     SEQUENCE {
 *   version             [0]     EXPLICIT Version DEFAULT v1,
 *   requestorName       [1]     EXPLICIT GeneralName OPTIONAL,
 *   requestList                 SEQUENCE OF Request,
 *   requestExtensions   [2]     EXPLICIT Extensions OPTIONAL }
 * ```
 */
export class TBSRequest {

  @AsnProp({type: AsnPropTypes.Integer, context: 0, defaultValue: 0})
  public version = 0;
  
  @AsnProp({type: GeneralName, context: 1, optional: true})
  public requestorName?: GeneralName;
  
  @AsnProp({type: Request, repeated: "sequence"})
  public requestList: Request[] = [];
  
  @AsnProp({type: Extension, context: 2, optional: true, repeated: "sequence"})
  public requestExtensions?: Extension[];
  
  constructor(params: Partial<TBSRequest> = {}) {
    Object.assign(this, params);
  }
}
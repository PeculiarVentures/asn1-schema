import { AsnProp, AsnPropTypes } from "@peculiar/asn1-schema";
import { GeneralName, Extension } from "@peculiar/asn1-x509";
import { Request } from "./request";
import { Version } from "./types";

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

  @AsnProp({ type: AsnPropTypes.Integer, context: 0, defaultValue: Version.v1 })
  public version = Version.v1;

  @AsnProp({ type: GeneralName, context: 1, optional: true })
  public requestorName?: GeneralName;

  @AsnProp({ type: Request, repeated: "sequence" })
  public requestList: Request[] = [];

  @AsnProp({ type: Extension, context: 2, optional: true, repeated: "sequence" })
  public requestExtensions?: Extension[];

  constructor(params: Partial<TBSRequest> = {}) {
    Object.assign(this, params);
  }
}
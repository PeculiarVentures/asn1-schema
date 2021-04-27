import { AsnProp, AsnPropTypes } from "@peculiar/asn1-schema";
import { CertID } from "./cert_id";
import { Extensions, Extension } from "@peculiar/asn1-x509";
import { CertStatus } from "./cert_status";

/**
 * ```
 * SingleResponse ::= SEQUENCE {
 *   certID                       CertID,
 *   certStatus                   CertStatus,
 *   thisUpdate                   GeneralizedTime,
 *   nextUpdate           [0]     EXPLICIT GeneralizedTime OPTIONAL,
 *   singleExtensions     [1]     EXPLICIT Extensions{{re-ocsp-crl |
 *                                             re-ocsp-archive-cutoff |
 *                                             CrlEntryExtensions, ...}
 *                                             } OPTIONAL }
 * ```
 */
export class SingleResponse {

  @AsnProp({ type: CertID })
  public certID = new CertID();

  @AsnProp({ type: CertStatus })
  public certStatus = new CertStatus();

  @AsnProp({ type: AsnPropTypes.GeneralizedTime })
  public thisUpdate = new Date();

  @AsnProp({ type: AsnPropTypes.GeneralizedTime, context: 0, optional: true })
  public nextUpdate?: Date;

  @AsnProp({ type: Extension, context: 1, repeated: "sequence", optional: true })
  public singleExtensions?: Extension[];

  constructor(params: Partial<SingleResponse> = {}) {
    Object.assign(this, params);
  }
}
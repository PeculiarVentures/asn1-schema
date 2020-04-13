import { AsnProp, AsnPropTypes, AsnIntegerArrayBufferConverter } from "@peculiar/asn1-schema";
import { AlgorithmIdentifier } from "./algorithm_identifier";
import { Name } from "./name";
import { Time } from "./time";
import { Extension } from "./extension";
import { Version } from "./types";

/**
 * Revoked certificate
 * ```
 * SEQUENCE  {
 *   userCertificate         CertificateSerialNumber,
 *   revocationDate          Time,
 *   crlEntryExtensions      Extensions OPTIONAL
 *                            -- if present, version MUST be v2
 * }
 * ```
 */
export class RevokedCertificate {
  /**
   * Serial number of the certificate
   */
  @AsnProp({ type: AsnPropTypes.Integer, converter: AsnIntegerArrayBufferConverter })
  public userCertificate: ArrayBuffer = new ArrayBuffer(0);

  /**
   * Revocation date
   */
  @AsnProp({ type: Time })
  public revocationDate = new Time();

  @AsnProp({ type: Extension, optional: true, repeated: "sequence" })
  public crlEntryExtensions?: Extension[];

  constructor(params: Partial<RevokedCertificate> = {}) {
    Object.assign(this, params);
  }
}

/**
 * ```
 * TBSCertList  ::=  SEQUENCE  {
 *   version                 Version OPTIONAL,
 *                                 -- if present, MUST be v2
 *   signature               AlgorithmIdentifier,
 *   issuer                  Name,
 *   thisUpdate              Time,
 *   nextUpdate              Time OPTIONAL,
 *   revokedCertificates     SEQUENCE OF SEQUENCE  {
 *        userCertificate         CertificateSerialNumber,
 *        revocationDate          Time,
 *        crlEntryExtensions      Extensions OPTIONAL
 *                                 -- if present, version MUST be v2
 *                             }  OPTIONAL,
 *   crlExtensions           [0] Extensions OPTIONAL }
 *                                 -- if present, version MUST be v2
 * ```
 */
export class TBSCertList {

  @AsnProp({ type: AsnPropTypes.Integer, optional: true })
  public version?: Version;

  @AsnProp({ type: AlgorithmIdentifier })
  public signature = new AlgorithmIdentifier();

  @AsnProp({ type: Name })
  public issuer = new Name();

  @AsnProp({ type: Time })
  public thisUpdate = new Time();

  @AsnProp({ type: Time, optional: true })
  public nextUpdate?: Time;

  @AsnProp({ type: RevokedCertificate, repeated: "sequence", optional: true })
  public revokedCertificates?: RevokedCertificate[];

  @AsnProp({ type: Extension, optional: true, context: 0, repeated: "sequence" })
  public crlExtensions?: Extension[];

  constructor(params: Partial<TBSCertList> = {}) {
    Object.assign(this, params);
  }
}

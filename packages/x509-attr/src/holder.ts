import { AsnProp } from "@peculiar/asn1-schema";
import { IssuerSerial } from "./issuer_serial";
import { GeneralNames } from "@peculiar/asn1-x509";
import { ObjectDigestInfo } from "./object_digest_info";

/**
 * ```
 * Holder ::= SEQUENCE {
 *      baseCertificateID   [0] IssuerSerial OPTIONAL,
 *                -- the issuer and serial number of
 *                -- the holder's Public Key Certificate
 *      entityName          [1] GeneralNames OPTIONAL,
 *                -- the name of the claimant or role
 *      objectDigestInfo    [2] ObjectDigestInfo OPTIONAL
 *                -- used to directly authenticate the
 *                -- holder, for example, an executable
 * }
 * ```
 */
export class Holder {
  @AsnProp({ type: IssuerSerial, implicit: true, context: 0, optional: true })
  public baseCertificateID?: IssuerSerial;

  @AsnProp({ type: GeneralNames, implicit: true, context: 1, optional: true })
  public entityName?: GeneralNames;

  @AsnProp({ type: ObjectDigestInfo, implicit: true, context: 2, optional: true })
  public objectDigestInfo?: ObjectDigestInfo;

  constructor(params: Partial<Holder> = {}) {
    Object.assign(this, params);
  }
}

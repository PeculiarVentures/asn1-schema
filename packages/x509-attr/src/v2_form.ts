import { AsnProp } from "@peculiar/asn1-schema";
import { GeneralNames } from "@peculiar/asn1-x509";
import { IssuerSerial } from "./issuer_serial";
import { ObjectDigestInfo } from "./object_digest_info";

/**
 * ```asn1
 * V2Form ::= SEQUENCE {
 *      issuerName            GeneralNames  OPTIONAL,
 *      baseCertificateID     [0] IssuerSerial  OPTIONAL,
 *      objectDigestInfo      [1] ObjectDigestInfo  OPTIONAL
 *         -- issuerName MUST be present in this profile
 *         -- baseCertificateID and objectDigestInfo MUST
 *         -- NOT be present in this profile
 * }
 * ```
 */
export class V2Form {
  @AsnProp({ type: GeneralNames, optional: true })
  public issuerName?: GeneralNames;

  @AsnProp({ type: IssuerSerial, context: 0, implicit: true, optional: true })
  public baseCertificateID?: IssuerSerial;

  @AsnProp({ type: ObjectDigestInfo, context: 1, implicit: true, optional: true })
  public objectDigestInfo?: ObjectDigestInfo;

  constructor(params: Partial<V2Form> = {}) {
    Object.assign(this, params);
  }
}

import { AsnProp } from "@peculiar/asn1-schema";
import { PKIStatusInfo } from "./pki_status_info";
import { TimeStampToken } from "./time_stamp_token";

/**
 * ```asn1
 * TimeStampResp ::= SEQUENCE  {
 *   status                  PKIStatusInfo,
 *   timeStampToken          TimeStampToken     OPTIONAL  }
 * ```
 */

export class TimeStampResp {
  @AsnProp({ type: PKIStatusInfo })
  public status = new PKIStatusInfo();

  @AsnProp({ type: TimeStampToken, optional: true })
  public timeStampToken?: TimeStampToken;

  constructor(params: Partial<TimeStampResp> = {}) {
    Object.assign(this, params);
  }
}

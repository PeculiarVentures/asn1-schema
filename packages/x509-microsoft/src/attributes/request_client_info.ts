import { AsnProp, AsnPropTypes } from "@peculiar/asn1-schema";

export const id_requestClientInfo = "1.3.6.1.4.1.311.21.20";

/**
 * ```asn1
 * SEQUENCE {
 *   clientId INTEGER,
 *   MachineName UTF8STRING,
 *   UserName UTF8STRING,
 *   ProcessName UTF8STRING
 * }
 * ```
 */
export class RequestClientInfo {
  @AsnProp({ type: AsnPropTypes.Integer })
  public clientId = 0;

  @AsnProp({ type: AsnPropTypes.Utf8String })
  public machineName = "";

  @AsnProp({ type: AsnPropTypes.Utf8String })
  public userName = "";

  @AsnProp({ type: AsnPropTypes.Utf8String })
  public processName = "";

  constructor(params: Partial<RequestClientInfo> = {}) {
    Object.assign(this, params);
  }
}

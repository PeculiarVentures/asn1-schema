import { AsnProp, AsnPropTypes } from "@peculiar/asn1-schema";
import { LogotypeInfo } from "./logotype_info";

/**
 * ```
 * OtherLogotypeInfo ::= SEQUENCE {
 *   logotypeType    OBJECT IDENTIFIER,
 *   info            LogotypeInfo }
 * ```
 */
export class OtherLogotypeInfo {

  @AsnProp({ type: AsnPropTypes.ObjectIdentifier })
  public logotypeType = "";
  
  @AsnProp({ type: LogotypeInfo })
  public info = new LogotypeInfo();

  constructor(params: Partial<OtherLogotypeInfo> = {}) {
    Object.assign(this, params);
  }
}
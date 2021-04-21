import { AsnProp } from "@peculiar/asn1-schema";
import { LogotypeInfo } from "./logotype_info";
import { OtherLogotypeInfo } from "./other_logotype_info";

/**
 * ```
 * LogotypeExtn ::= SEQUENCE {
 *   communityLogos  [0] EXPLICIT SEQUENCE OF LogotypeInfo OPTIONAL,
 *   issuerLogo      [1] EXPLICIT LogotypeInfo OPTIONAL,
 *   subjectLogo     [2] EXPLICIT LogotypeInfo OPTIONAL,
 *   otherLogos      [3] EXPLICIT SEQUENCE OF OtherLogotypeInfo OPTIONAL }
 * ```
 */
export class LogotypeExtn {

  @AsnProp({ type: LogotypeInfo, context: 0, repeated: "sequence", optional: true })
  public communityLogos?: LogotypeInfo[];

  @AsnProp({ type: LogotypeInfo, context: 1, optional: true })
  public issuerLogo?: LogotypeInfo;

  @AsnProp({ type: LogotypeInfo, context: 2, optional: true })
  public subjectLogo?: LogotypeInfo;

  @AsnProp({ type: OtherLogotypeInfo, context: 3, repeated: "sequence", optional: true })
  public otherLogos?: OtherLogotypeInfo[];

  constructor(params: Partial<LogotypeExtn> = {}) {
    Object.assign(this, params);
  }
}

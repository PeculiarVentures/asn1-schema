import { AsnProp, AsnType, AsnTypeTypes } from "@peculiar/asn1-schema";
import { LogotypeData } from "./logotype_data";
import { LogotypeReference } from "./logotype_reference";

/**
 * ```asn1
 * LogotypeInfo ::= CHOICE {
 *   direct          [0] LogotypeData,
 *   indirect        [1] LogotypeReference }
 * ```
 */
@AsnType({ type: AsnTypeTypes.Choice })
export class LogotypeInfo {
  @AsnProp({ type: LogotypeData, implicit: true, context: 0 })
  public direct?: LogotypeData;

  @AsnProp({ type: LogotypeReference, implicit: true, context: 1 })
  public indirect?: LogotypeReference;

  constructor(params: Partial<LogotypeInfo> = {}) {
    Object.assign(this, params);
  }
}

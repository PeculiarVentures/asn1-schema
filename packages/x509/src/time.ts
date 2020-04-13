import { AsnProp, AsnPropTypes, AsnType, AsnTypeTypes } from "@peculiar/asn1-schema";
/**
 * ```
 * Time ::= CHOICE {
 *   utcTime        UTCTime,
 *   generalTime    GeneralizedTime }
 * ```
 */
@AsnType({ type: AsnTypeTypes.Choice })
export class Time {

  @AsnProp({
    type: AsnPropTypes.UTCTime,
  })
  public utcTime?: Date;

  @AsnProp({
    type: AsnPropTypes.GeneralizedTime,
  })
  public generalTime?: Date;

  constructor(time?: Date | string | number | Partial<Time>) {
    if (time) {
      if (typeof time === "string" || typeof time === "number") {
        this.utcTime = new Date(time);
      } else if (time instanceof Date) {
        this.utcTime = time;
      } else {
        Object.assign(this, time);
      }
    }
  }

}

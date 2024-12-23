import { AsnProp, AsnPropTypes, AsnType, AsnTypeTypes } from "@peculiar/asn1-schema";
/**
 * ```asn1
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
      if (typeof time === "string" || typeof time === "number" || time instanceof Date) {
        // CAs conforming to this profile MUST always encode certificate
        // validity dates through the year 2049 as UTCTime; certificate validity
        // dates in 2050 or later MUST be encoded as GeneralizedTime
        const date = new Date(time);
        if (date.getUTCFullYear() > 2049) {
          this.generalTime = date;
        } else {
          this.utcTime = date;
        }
      } else {
        Object.assign(this, time);
      }
    }
  }

  public getTime(): Date {
    const time = this.utcTime || this.generalTime;
    if (!time) {
      throw new Error("Cannot get time from CHOICE object");
    }
    return time;
  }
}

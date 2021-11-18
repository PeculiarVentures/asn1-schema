import { Convert } from "pvtsutils";
import { AsnDateObject } from "./DateObject";
import { universal } from "./Types";

@universal(24)
export class AsnGeneralizedTime extends AsnDateObject {

  public static override readonly BER_IDENTIFIER = new Uint8Array([0x18]);
  public static readonly NAME = "GeneralizedTime";

  public readonly name: typeof AsnGeneralizedTime.NAME = AsnGeneralizedTime.NAME;

  constructor(date?: Date) {
    super();

    if (date) {
      this.date = date;
    }
  }

  public get date(): Date {
    // YYYYMMDDhhmmss[.f]Z        # UTC
    // YYYYMMDDhhmmss[.f]         # local time (non-standard)
    // YYYYMMDDhhmmss[.f]+-hhmm   # difference between local time and UTC time (non-standard)
    const dateString = Convert.ToBinary(this.content.view);
    const reg = /^([0-9]{4})([0-9]{2})([0-9]{2})([0-9]{2})([0-9]{2})([0-9]{2})([.,][0-9]{0,3})?(?:(Z)?|([+-][0-9]{4}))$/;

    const m = reg.exec(dateString);
    if (!m) {
      throw new Error("Time value doesn't match the GeneralizedTime format");
    }

    const year = parseInt(m[1]);
    const month = parseInt(m[2]);
    const day = parseInt(m[3]);
    const hour = parseInt(m[4]);
    const minute = parseInt(m[5]);
    const second = parseInt(m[6]);
    const millisecond = m[7] ? parseInt(m[7].substring(1).padEnd(3, "0")) : 0;

    const m9 = m[9];
    if (m9) {
      const increase = m9.startsWith("+") ? -1 : 1;
      const diffHour = parseInt(m9.substring(1, 3)) * increase;
      const diffMinute = parseInt(m9.substring(3)) * increase;

      return new Date(Date.UTC(year, month - 1, day, hour + diffHour, minute + diffMinute, second, millisecond));
    } else {
      if (!m[8]) {
        // local
        return new Date(year, month - 1, day, hour, minute, second, millisecond);
      } else {
        // UTC
        return new Date(Date.UTC(year, month - 1, day, hour, minute, second, millisecond));
      }
    }
  }

  public set date(value: Date) {
    const matches = this.splitDate(value);

    const dateString = `${matches.join("")}Z`;
    this.content.view = new Uint8Array(Convert.FromBinary(dateString));
  }

  protected override toAsnString(): string {
    const m = this.splitDate(this.date);

    const dateString = `${m[0]}-${m[1]}-${m[2]} ${m[3]}:${m[4]}:${m[5]}${m[6] || ""} UTC`;

    return `${this.name} ${dateString}`;
  }

}

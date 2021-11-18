import { Convert } from "pvtsutils";
import { AsnDateObject } from "./DateObject";
import { universal } from "./Types";

@universal(23)
export class AsnUTCTime extends AsnDateObject {

  public static override readonly BER_IDENTIFIER = new Uint8Array([0x17]);
  public static readonly NAME = "UTCTime";

  public readonly name: typeof AsnUTCTime.NAME = AsnUTCTime.NAME;

  constructor(date?: Date) {
    super();

    if (date) {
      this.date = date;
    }
  }

  public get date(): Date {
    // YYMMDDhhmmssZ          # UTC
    // YYMMDDhhmm[ss]Z        # UTC (non-standard)
    // YYMMDDhhmm[ss]         # Local (non-standard)
    // YYMMDDhhmm[ss]+-hhmm   # Local (non-standard)
    const dateString = Convert.ToBinary(this.content.view);
    const parser = /^(\d{2})(\d{2})(\d{2})(\d{2})(\d{2})(\d{2})(?:(Z)?|([+-][0-9]{4}))?$/;
    const m = parser.exec(dateString);
    if (m === null) {
      throw new Error("Time value doesn't match the UTCTime format");
    }

    let year = parseInt(m[1]);
    year = (year >= 50)
      ? year = 1900 + year
      : year = 2000 + year;

    const month = parseInt(m[2]);
    const day = parseInt(m[3]);
    const hour = parseInt(m[4]);
    const minute = parseInt(m[5]);
    const second = m[6] ? parseInt(m[6]) : 0;

    const m8 = m[8];
    if (m8) {
      const increase = m8.startsWith("+") ? -1 : 1;
      const diffHour = parseInt(m8.substring(1, 3)) * increase;
      const diffMinute = parseInt(m8.substring(3)) * increase;

      return new Date(Date.UTC(year, month - 1, day, hour + diffHour, minute + diffMinute, second));
    } else {
      if (!m[7]) {
        // local
        return new Date(year, month - 1, day, hour, minute, second);
      } else {
        // UTC
        return new Date(Date.UTC(year, month - 1, day, hour, minute, second));
      }
    }
  }

  public set date(value: Date) {
    const utcYear = value.getUTCFullYear();
    if (1950 > utcYear || utcYear > 2049) {
      throw new Error("UTC date year must be in the range between 1950 and 2049");
    }
    const m = this.splitDate(value);

    m[0] = m[0].substring(2); // YYYY -> YY
    m.splice(6, 1); // remove milliseconds

    const dateString = `${m.join("")}Z`;
    this.content.view = new Uint8Array(Convert.FromBinary(dateString));
  }

  protected override toAsnString(): string {
    const m = this.splitDate(this.date);

    const dateString = `${m[0]}-${m[1]}-${m[2]} ${m[3]}:${m[4]}:${m[5]}${m[6] || ""} UTC`;

    return `${this.name} ${dateString}`;
  }

}

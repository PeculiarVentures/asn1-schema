import { AsnObject } from "./Object";
import { AsnString } from "./String";

type SplittedDate = [string, string, string, string, string, string, string?];

export abstract class AsnDateObject extends AsnString {

  public static readonly REGEX_ISO_TIME = /^([0-9]{4})-([0-9]{2})-([0-9]{2})T([0-9]{2}):([0-9]{2}):([0-9]{2})\.([0-9]{0,2}[1-9])?0{0,3}Z/;

  public abstract date: Date;

  protected splitDate(value: Date): SplittedDate {
    const reg = new RegExp(AsnDateObject.REGEX_ISO_TIME);
    const matches = reg.exec(value.toISOString());
    if (!matches) {
      throw new Error("Invalid format of string representation of the date");
    }

    const milliseconds = matches[7];
    if (milliseconds) {
      matches[7] = `.${milliseconds}`;
    }

    matches.splice(0, 1); // remove Match

    return matches as unknown as SplittedDate; // fix type
  }

}

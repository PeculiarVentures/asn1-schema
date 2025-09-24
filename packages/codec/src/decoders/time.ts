import { AsnNode } from "../types";
import { StringDecoders } from "./strings";

/**
 * Decoders for ASN.1 time types
 */
export class TimeDecoders {
  /**
   * Decode UTCTime
   */
  static decodeUtcTime(node: AsnNode): Date {
    const str = StringDecoders.decodeIa5String(node);

    // UTCTime format: YYMMDDHHMMSSZ or YYMMDDHHMMSS+HHMM
    if (str.length < 13) {
      throw new Error("Invalid UTCTime: too short");
    }

    const year = parseInt(str.substring(0, 2), 10);
    const month = parseInt(str.substring(2, 4), 10) - 1; // Month is 0-based
    const day = parseInt(str.substring(4, 6), 10);
    const hour = parseInt(str.substring(6, 8), 10);
    const minute = parseInt(str.substring(8, 10), 10);
    const second = parseInt(str.substring(10, 12), 10);

    // Y2K handling: 50-99 -> 1950-1999, 00-49 -> 2000-2049
    const fullYear = year >= 50 ? 1900 + year : 2000 + year;

    if (str.endsWith("Z")) {
      return new Date(Date.UTC(fullYear, month, day, hour, minute, second));
    } else {
      // Handle timezone offset (simplified)
      return new Date(fullYear, month, day, hour, minute, second);
    }
  }

  /**
   * Decode GeneralizedTime
   */
  static decodeGeneralizedTime(node: AsnNode): Date {
    const str = StringDecoders.decodeAsciiString(node);

    // GeneralizedTime format: YYYYMMDDHHMMSSZ or YYYYMMDDHHMMSS.fZ
    const genPattern = /^(\d{4})(\d{2})(\d{2})(\d{2})(\d{2})(\d{2})(?:\.(\d+))?Z$/;
    const match = str.match(genPattern);

    if (!match) {
      throw new Error("Invalid GeneralizedTime format");
    }

    const [, yearStr, monthStr, dayStr, hourStr, minStr, secStr, fracStr] = match;

    const year = parseInt(yearStr, 10);
    const month = parseInt(monthStr, 10) - 1; // Month is 0-based
    const day = parseInt(dayStr, 10);
    const hour = parseInt(hourStr, 10);
    const minute = parseInt(minStr, 10);
    const second = parseInt(secStr, 10);

    let milliseconds = 0;
    if (fracStr) {
      // Pad to 3 digits and take first 3 to handle up to microseconds
      const fracPadded = fracStr.padEnd(3, "0");
      milliseconds = parseInt(fracPadded.substring(0, 3), 10);
    }

    // Always UTC since ends with Z
    return new Date(Date.UTC(year, month, day, hour, minute, second, milliseconds));
  }
}

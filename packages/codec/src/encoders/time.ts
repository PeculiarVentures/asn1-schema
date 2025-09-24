import { SerializeContext, AsnTag } from "../types";
import { TlvEncoder } from "../core/encoder";
import { StringEncoders } from "./strings";

/**
 * Encoders for ASN.1 time types
 */
export class TimeEncoders {
  /**
   * Encode UTCTime from Date object
   */
  static encodeUtcTime(value: Date): Uint8Array {
    // UTCTime format: YYMMDDHHMMSSZ
    const year = value.getUTCFullYear();
    const month = value.getUTCMonth() + 1; // Month is 0-based
    const day = value.getUTCDate();
    const hour = value.getUTCHours();
    const minute = value.getUTCMinutes();
    const second = value.getUTCSeconds();

    // Check year range for UTCTime (1950-2049)
    if (year < 1950 || year >= 2050) {
      throw new Error(`Year ${year} is out of range for UTCTime (1950-2049)`);
    }

    // Convert to 2-digit year
    const shortYear = year >= 2000 ? year - 2000 : year - 1900;

    // Format: YYMMDDHHMMSSZ
    const timeStr =
      shortYear.toString().padStart(2, "0") +
      month.toString().padStart(2, "0") +
      day.toString().padStart(2, "0") +
      hour.toString().padStart(2, "0") +
      minute.toString().padStart(2, "0") +
      second.toString().padStart(2, "0") +
      "Z";

    return StringEncoders.encodeIa5String(timeStr);
  }

  /**
   * Encode GeneralizedTime from Date object
   */
  static encodeGeneralizedTime(value: Date): Uint8Array {
    // GeneralizedTime format: YYYYMMDDHHMMSSZ or YYYYMMDDHHMMSS.fZ
    const year = value.getUTCFullYear();
    const month = value.getUTCMonth() + 1;
    const day = value.getUTCDate();
    const hour = value.getUTCHours();
    const minute = value.getUTCMinutes();
    const second = value.getUTCSeconds();
    const milliseconds = value.getUTCMilliseconds();

    let timeStr =
      year.toString().padStart(4, "0") +
      month.toString().padStart(2, "0") +
      day.toString().padStart(2, "0") +
      hour.toString().padStart(2, "0") +
      minute.toString().padStart(2, "0") +
      second.toString().padStart(2, "0");

    // Add fractional seconds if not zero
    if (milliseconds > 0) {
      // Remove trailing zeros from milliseconds
      const fractionStr = milliseconds.toString().padStart(3, "0").replace(/0+$/, "");
      timeStr += "." + fractionStr;
    }

    timeStr += "Z";

    return StringEncoders.encodeIa5String(timeStr);
  }

  /**
   * Encode GeneralizedTime with fractional seconds
   */
  static encodeGeneralizedTimeWithFraction(value: Date): Uint8Array {
    // GeneralizedTime format: YYYYMMDDHHMMSS.fZ
    const year = value.getUTCFullYear();
    const month = value.getUTCMonth() + 1;
    const day = value.getUTCDate();
    const hour = value.getUTCHours();
    const minute = value.getUTCMinutes();
    const second = value.getUTCSeconds();
    const milliseconds = value.getUTCMilliseconds();

    let timeStr =
      year.toString().padStart(4, "0") +
      month.toString().padStart(2, "0") +
      day.toString().padStart(2, "0") +
      hour.toString().padStart(2, "0") +
      minute.toString().padStart(2, "0") +
      second.toString().padStart(2, "0");

    // Add fractional seconds if not zero
    if (milliseconds > 0) {
      // Remove trailing zeros from milliseconds
      const fractionStr = milliseconds.toString().padStart(3, "0").replace(/0+$/, "");
      timeStr += "." + fractionStr;
    }

    timeStr += "Z";

    return StringEncoders.encodeIa5String(timeStr);
  }

  /**
   * Auto-encode Date to appropriate time type
   */
  static encodeAutoTime(value: Date): { tag: AsnTag; content: Uint8Array } {
    const year = value.getUTCFullYear();

    // Use UTCTime for years 1950-2049, GeneralizedTime otherwise
    if (year >= 1950 && year < 2050) {
      return {
        tag: { cls: 0, tag: 23, constructed: false }, // UTCTime
        content: this.encodeUtcTime(value),
      };
    } else {
      return {
        tag: { cls: 0, tag: 24, constructed: false }, // GeneralizedTime
        content: this.encodeGeneralizedTime(value),
      };
    }
  }

  /**
   * Create complete TLV for UTCTime
   */
  static encodeUtcTimeTlv(value: Date): Uint8Array {
    const tag: AsnTag = { cls: 0, tag: 23, constructed: false };
    const content = this.encodeUtcTime(value);
    return TlvEncoder.encodeTlv(tag, content);
  }

  /**
   * Create complete TLV for GeneralizedTime
   */
  static encodeGeneralizedTimeTlv(value: Date): Uint8Array {
    const tag: AsnTag = { cls: 0, tag: 24, constructed: false };
    const content = this.encodeGeneralizedTime(value);
    return TlvEncoder.encodeTlv(tag, content);
  }

  /**
   * Parse and validate time string for UTCTime
   */
  static validateUtcTimeString(timeStr: string): boolean {
    // UTCTime: YYMMDDHHMMSSZ or YYMMDDHHMMSS+HHMM
    const utcPattern = /^(\d{2})(\d{2})(\d{2})(\d{2})(\d{2})(\d{2})Z$/;
    const match = timeStr.match(utcPattern);

    if (!match) return false;

    const [, year, month, day, hour, minute, second] = match;

    // Basic range validation
    const m = parseInt(month, 10);
    const d = parseInt(day, 10);
    const h = parseInt(hour, 10);
    const min = parseInt(minute, 10);
    const s = parseInt(second, 10);

    return (
      m >= 1 &&
      m <= 12 &&
      d >= 1 &&
      d <= 31 &&
      h >= 0 &&
      h <= 23 &&
      min >= 0 &&
      min <= 59 &&
      s >= 0 &&
      s <= 59
    );
  }

  /**
   * Parse and validate time string for GeneralizedTime
   */
  static validateGeneralizedTimeString(timeStr: string): boolean {
    // GeneralizedTime: YYYYMMDDHHMMSSZ or YYYYMMDDHHMMSS.fZ
    const genPattern = /^(\d{4})(\d{2})(\d{2})(\d{2})(\d{2})(\d{2})(?:\.(\d+))?Z$/;
    const match = timeStr.match(genPattern);

    if (!match) return false;

    const [, year, month, day, hour, minute, second] = match;

    // Basic range validation
    const y = parseInt(year, 10);
    const m = parseInt(month, 10);
    const d = parseInt(day, 10);
    const h = parseInt(hour, 10);
    const min = parseInt(minute, 10);
    const s = parseInt(second, 10);

    return (
      y >= 1000 &&
      y <= 9999 &&
      m >= 1 &&
      m <= 12 &&
      d >= 1 &&
      d <= 31 &&
      h >= 0 &&
      h <= 23 &&
      min >= 0 &&
      min <= 59 &&
      s >= 0 &&
      s <= 59
    );
  }
}

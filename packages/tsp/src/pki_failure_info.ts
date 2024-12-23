import { BitString } from "@peculiar/asn1-schema";

export enum PKIFailureInfoFlags {
  /**
   * unrecognized or unsupported Algorithm Identifier
   */
  badAlg = 0x00000001,
  /**
   * transaction not permitted or supported
   */
  badRequest = 0x00000002,
  /**
   * the data submitted has the wrong format
   */
  badDataFormat = 0x00000010,
  /**
   * the TSA's time source is not available
   */
  timeNotAvailable = 0x00002000,
  /**
   * the requested TSA policy is not supported by the TSA
   */
  unacceptedPolicy = 0x00004000,
  /**
   * the requested extension is not supported by the TSA
   */
  unacceptedExtension = 0x00008000,
  /**
   * the additional information requested could not be understood
   * or is not available
   */
  addInfoNotAvailable = 0x00010000,
  /**
   * the request cannot be handled due to system failure
   */
  systemFailure = 0x01000000,
}

export type PKIFailureInfoType = keyof typeof PKIFailureInfoFlags;
export type PKIFailureInfoJson = PKIFailureInfoType[];

/**
 * ```
 * PKIFailureInfo ::= BIT STRING {
 *  badAlg               (0),
 *    -- unrecognized or unsupported Algorithm Identifier
 *  badRequest           (2),
 *    -- transaction not permitted or supported
 *  badDataFormat        (5),
 *    -- the data submitted has the wrong format
 *  timeNotAvailable    (14),
 *    -- the TSA's time source is not available
 *  unacceptedPolicy    (15),
 *    -- the requested TSA policy is not supported by the TSA
 *  unacceptedExtension (16),
 *    -- the requested extension is not supported by the TSA
 *   addInfoNotAvailable (17)
 *     -- the additional information requested could not be understood
 *     -- or is not available
 *   systemFailure       (25)
 *     -- the request cannot be handled due to system failure  }
 * ```
 */

export class PKIFailureInfo extends BitString {
  public toJSON(): PKIFailureInfoJson {
    const flag = this.toNumber();
    const res: PKIFailureInfoType[] = [];
    if (flag & PKIFailureInfoFlags.addInfoNotAvailable) {
      res.push("addInfoNotAvailable");
    }
    if (flag & PKIFailureInfoFlags.badAlg) {
      res.push("badAlg");
    }
    if (flag & PKIFailureInfoFlags.badDataFormat) {
      res.push("badDataFormat");
    }
    if (flag & PKIFailureInfoFlags.badRequest) {
      res.push("badRequest");
    }
    if (flag & PKIFailureInfoFlags.systemFailure) {
      res.push("systemFailure");
    }
    if (flag & PKIFailureInfoFlags.systemFailure) {
      res.push("systemFailure");
    }
    if (flag & PKIFailureInfoFlags.timeNotAvailable) {
      res.push("timeNotAvailable");
    }
    if (flag & PKIFailureInfoFlags.unacceptedExtension) {
      res.push("unacceptedExtension");
    }
    if (flag & PKIFailureInfoFlags.unacceptedPolicy) {
      res.push("unacceptedPolicy");
    }

    return res;
  }

  public override toString(): string {
    return `[${this.toJSON().join(", ")}]`;
  }
}

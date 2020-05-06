import { AsnProp } from "@peculiar/asn1-schema";
import { LogotypeDetails } from "./logotype_details";
import { LogotypeImageInfo } from "./logotype_image_info";

/**
 * ```
 * LogotypeImage ::= SEQUENCE {
 *   imageDetails    LogotypeDetails,
 *   imageInfo       LogotypeImageInfo OPTIONAL }
 * ```
 */
export class LogotypeImage {

  @AsnProp({ type: LogotypeDetails })
  public imageDetails = new LogotypeDetails();

  @AsnProp({ type: LogotypeImageInfo, optional: true })
  public imageInfo?: LogotypeImageInfo;

  constructor(params: Partial<LogotypeImage> = {}) {
    Object.assign(this, params);
  }
}
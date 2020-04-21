import { AsnProp } from "@peculiar/asn1-schema";
import { LogotypeDetails } from "./logotype_details";
import { LogotypeAudioInfo } from "./logotype_audio_info";

/**
 * ```
 * LogotypeAudio ::= SEQUENCE {
 *   audioDetails    LogotypeDetails,
 *   audioInfo       LogotypeAudioInfo OPTIONAL }
 * ```
 */
export class LogotypeAudio {

  @AsnProp({ type: LogotypeDetails })
  public imageDetails = new LogotypeDetails();

  @AsnProp({ type: LogotypeAudioInfo, optional: true })
  public imageInfo?: LogotypeAudioInfo;

  constructor(params: Partial<LogotypeAudio> = {}) {
    Object.assign(this, params);
  }
}
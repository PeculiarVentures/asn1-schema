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
  public audioDetails = new LogotypeDetails();

  @AsnProp({ type: LogotypeAudioInfo, optional: true })
  public audioInfo?: LogotypeAudioInfo;

  constructor(params: Partial<LogotypeAudio> = {}) {
    Object.assign(this, params);
  }
}

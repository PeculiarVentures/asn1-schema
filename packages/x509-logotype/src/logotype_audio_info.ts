import { AsnProp, AsnPropTypes } from "@peculiar/asn1-schema";

export enum LogotypeAudioChannels {
  mono = 1,
  stereo = 2,
  quad = 4,
}

/**
 * ```asn1
 * LogotypeAudioInfo ::= SEQUENCE {
 *   fileSize        INTEGER,  -- In octets, 0=unspecified
 *   playTime        INTEGER,  -- In milliseconds, 0=unspecified
 *   channels        INTEGER,  -- 0=unspecified, 1=mono, 2=stereo, 4=quad
 *   sampleRate      [3] INTEGER OPTIONAL,  -- Samples per second
 *   language        [4] IA5String OPTIONAL }  -- RFC 5646 Language Tag
 * ```
 */
export class LogotypeAudioInfo {
  /**
   * In octets
   */
  @AsnProp({ type: AsnPropTypes.Integer })
  public fileSize = 0;

  /**
   * In milliseconds
   */
  @AsnProp({ type: AsnPropTypes.Integer })
  public playTime = 0;

  /**
   * 1=mono, 2=stereo, 4=quad
   */
  @AsnProp({ type: AsnPropTypes.Integer })
  public channels = LogotypeAudioChannels.mono;

  /**
   * Samples per second
   */
  @AsnProp({ type: AsnPropTypes.Integer, implicit: true, context: 3, optional: true })
  public sampleRate?: number;

  /**
   * RFC 3066 Language Tag
   */
  @AsnProp({ type: AsnPropTypes.IA5String, implicit: true, context: 4, optional: true })
  public language?: string;

  constructor(params: Partial<LogotypeAudioInfo> = {}) {
    Object.assign(this, params);
  }
}

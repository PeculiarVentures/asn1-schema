import { AsnProp } from "@peculiar/asn1-schema";
import { LogotypeAudio } from "./logotype_audio";
import { LogotypeImage } from "./logotype_image";

/**
 * ```
 * LogotypeData ::= SEQUENCE {
 *   image           SEQUENCE OF LogotypeImage OPTIONAL,
 *   audio           [1] SEQUENCE OF LogotypeAudio OPTIONAL }
 *    -- At least one image component MUST be present
 *    ( WITH COMPONENTS { ..., image PRESENT } )
 * ```
 */
export class LogotypeData {
  @AsnProp({ type: LogotypeImage, repeated: "sequence", optional: true })
  public image?: LogotypeImage[];

  @AsnProp({ type: LogotypeAudio, repeated: "sequence", context: 1, optional: true })
  public audio?: LogotypeAudio[];

  constructor(params: Partial<LogotypeData> = {}) {
    Object.assign(this, params);
  }
}

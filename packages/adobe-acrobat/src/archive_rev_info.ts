import { AsnPropTypes, AsnProp } from "@peculiar/asn1-schema";
import { Version } from "./version";

/**
 * ```
 * adbe-archiveRevInfo OBJECT IDENTIFIER ::=  { adbe(1.2.840.113583) acrobat(1) security(1) x509Ext(9) 2 }
 * ```
 */
export const id_adbe_archiveRevInfo = "1.2.840.113583.1.1.9.2";

/**
 * ```
 * ArchiveRevInfo ::= SEQUENCE {
 *     version             INTEGER  { v1(1) }, -- extension version
 * }
 * ```
 */
export class ArchiveRevInfo {
  @AsnProp({ type: AsnPropTypes.Integer })
  public version: Version = Version.v1;

  public constructor(params: Partial<ArchiveRevInfo> = {}) {
    Object.assign(this, params);
  }
}

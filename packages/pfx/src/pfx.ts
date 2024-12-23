import { AsnProp, AsnPropTypes } from "@peculiar/asn1-schema";
import { ContentInfo } from "@peculiar/asn1-cms";
import { MacData } from "./mac_data";

/**
 * ```
 * PFX ::= SEQUENCE {
 *   version    INTEGER {v3(3)}(v3,...),
 *   authSafe   ContentInfo,
 *   macData    MacData OPTIONAL
 * }
 * ```
 */
export class PFX {
  @AsnProp({ type: AsnPropTypes.Integer })
  public version = 3;

  @AsnProp({ type: ContentInfo })
  public authSafe = new ContentInfo();

  @AsnProp({ type: MacData, optional: true })
  public macData = new MacData();

  constructor(params: Partial<PFX> = {}) {
    Object.assign(this, params);
  }
}

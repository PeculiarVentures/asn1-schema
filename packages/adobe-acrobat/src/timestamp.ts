import { AsnProp, AsnPropTypes } from "@peculiar/asn1-schema";
import { GeneralName } from "@peculiar/asn1-x509";
import { Version } from "./version";

/**
 * ```asn1
 * adbe- OBJECT IDENTIFIER ::=  { adbe(1.2.840.113583) acrobat(1) security(1) x509Ext(9) 1 }
 * ```
 */
export const id_adbe_timestamp = "1.2.840.113583.1.1.9.1";

/**
 * ```asn1
 * Timestamp ::= SEQUENCE {
 *   version INTEGER  { v1(1) }, -- extension version
 *   location GeneralName (In v1 GeneralName can be only uniformResourceIdentifier)
 *   requiresAuth        boolean (default false), OPTIONAL
 * }
 * ```
 */

export class Timestamp {
  @AsnProp({ type: AsnPropTypes.Integer })
  public version: Version = Version.v1;

  @AsnProp({ type: GeneralName })
  public location: GeneralName = new GeneralName();

  @AsnProp({ type: AsnPropTypes.Boolean, defaultValue: false, optional: true })
  public requiresAuth = false;

  public constructor(params: Partial<Timestamp> = {}) {
    Object.assign(this, params);
  }
}

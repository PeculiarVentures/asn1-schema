import { AsnProp, AsnPropTypes } from "@peculiar/asn1-schema";
import { ClassList, ClassListFlags } from "./class_list";
import { SecurityCategory } from "./security_category";

/**
 * ```
 * Clearance  ::=  SEQUENCE {
 *      policyId       OBJECT IDENTIFIER,
 *      classList      ClassList DEFAULT {unclassified},
 *      securityCategories  SET OF SecurityCategory OPTIONAL
 * }
 * ```
 */
export class Clearance {

  @AsnProp({ type: AsnPropTypes.ObjectIdentifier })
  public policyId = "";

  @AsnProp({ type: ClassList, defaultValue: new ClassList(ClassListFlags.unclassified) })
  public classList = new ClassList(ClassListFlags.unclassified);

  @AsnProp({ type: SecurityCategory, repeated: "set" })
  public securityCategories?: SecurityCategory[];

  constructor(params: Partial<Clearance> = {}) {
    Object.assign(this, params);
  }
}

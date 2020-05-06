import { AsnProp, AsnPropTypes } from "@peculiar/asn1-schema";
import { ClassList, ClassListFlags } from "./class_list";
import { SecurityCategory } from "./security_category";

/**
 * ```
 * Clearance  ::=  SEQUENCE {
 *      policyId       [0] OBJECT IDENTIFIER,
 *      classList      [1] ClassList DEFAULT {unclassified},
 *      securityCategories
 *                     [2] SET OF SecurityCategory  OPTIONAL
 * }
 * ```
 */
export class Clearance {

  @AsnProp({ type: AsnPropTypes.ObjectIdentifier, implicit: true, context: 0 })
  public policyId = "";

  @AsnProp({ type: ClassList, implicit: true, context: 1, defaultValue: new ClassList(ClassListFlags.unclassified) })
  public classList = new ClassList(ClassListFlags.unclassified);

  @AsnProp({ type: SecurityCategory, implicit: true, context: 2, repeated: "set" })
  public securityCategories?: SecurityCategory[];

  constructor(params: Partial<Clearance> = {}) {
    Object.assign(this, params);
  }
}

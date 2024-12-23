import { AsnProp } from "@peculiar/asn1-schema";
import { GeneralNames, GeneralName } from "@peculiar/asn1-x509";

/**
 * ```
 * RoleSyntax ::= SEQUENCE {
 *      roleAuthority  [0] GeneralNames OPTIONAL,
 *      roleName       [1] GeneralName
 * }
 * ```
 */
export class RoleSyntax {
  @AsnProp({ type: GeneralNames, implicit: true, context: 0, optional: true })
  public roleAuthority?: GeneralNames;

  @AsnProp({ type: GeneralName, implicit: true, context: 1 })
  public roleName?: GeneralName;

  constructor(params: Partial<RoleSyntax> = {}) {
    Object.assign(this, params);
  }
}

import { AsnProp, AsnPropTypes } from "@peculiar/asn1-schema";
import { AttrSpec } from "./attr_spec";

/**
 * ```
 * AAControls ::= SEQUENCE {
 *      pathLenConstraint INTEGER (0..MAX) OPTIONAL,
 *      permittedAttrs    [0] AttrSpec OPTIONAL,
 *      excludedAttrs     [1] AttrSpec OPTIONAL,
 *      permitUnSpecified BOOLEAN DEFAULT TRUE
 * }
 * ```
 */
export class AAControls {
  @AsnProp({ type: AsnPropTypes.Integer, optional: true })
  public pathLenConstraint?: number;

  @AsnProp({ type: AttrSpec, implicit: true, context: 0, optional: true })
  public permittedAttrs?: AttrSpec;

  @AsnProp({ type: AttrSpec, implicit: true, context: 1, optional: true })
  public excludedAttrs?: AttrSpec;

  @AsnProp({ type: AsnPropTypes.Boolean, defaultValue: true })
  public permitUnSpecified = true;

  constructor(params: Partial<AAControls> = {}) {
    Object.assign(this, params);
  }
}

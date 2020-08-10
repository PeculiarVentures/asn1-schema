import { AsnProp, AsnPropTypes, AsnArray, AsnType, AsnTypeTypes } from "@peculiar/asn1-schema";
import { GeneralName } from "../general_name";
import { id_ce } from "../object_identifiers";

/**
 * ```
 * id-ce-nameConstraints OBJECT IDENTIFIER ::=  { id-ce 30 }
 * ```
 */
export const id_ce_nameConstraints = `${id_ce}.30`;

/**
 * ```
 * BaseDistance ::= INTEGER (0..MAX)
 * ```
 */
export type BaseDistance = number;

/**
 * ```
 * GeneralSubtree ::= SEQUENCE {
 *   base                    GeneralName,
 *   minimum         [0]     BaseDistance DEFAULT 0,
 *   maximum         [1]     BaseDistance OPTIONAL }
 * ```
 */
export class GeneralSubtree {

  @AsnProp({ type: GeneralName })
  public base = new GeneralName();

  @AsnProp({ type: AsnPropTypes.Integer, context: 0, defaultValue: 0, implicit: true })
  public minimum: BaseDistance = 0;

  @AsnProp({ type: AsnPropTypes.Integer, context: 1, optional: true, implicit: true })
  public maximum?: BaseDistance;

  constructor(params: Partial<GeneralSubtree> = {}) {
    Object.assign(this, params);
  }
}

/**
 * ```
 * GeneralSubtrees ::= SEQUENCE SIZE (1..MAX) OF GeneralSubtree
 * ```
 */
@AsnType({ type: AsnTypeTypes.Sequence, itemType: GeneralSubtree })
export class GeneralSubtrees extends AsnArray<GeneralSubtree> {

  constructor(items?: GeneralSubtree[]) {
    super(items);

    // Set the prototype explicitly.
    Object.setPrototypeOf(this, GeneralSubtrees.prototype);
  }

}

/**
 * ```
 * NameConstraints ::= SEQUENCE {
 *   permittedSubtrees       [0]     GeneralSubtrees OPTIONAL,
 *   excludedSubtrees        [1]     GeneralSubtrees OPTIONAL }
 * ```
 */
export class NameConstraints {

  @AsnProp({ type: GeneralSubtrees, context: 0, optional: true, implicit: true })
  public permittedSubtrees?: GeneralSubtrees;

  @AsnProp({ type: GeneralSubtrees, context: 1, optional: true, implicit: true })
  public excludedSubtrees?: GeneralSubtrees;

  constructor(params: Partial<NameConstraints> = {}) {
    Object.assign(this, params);
  }
}

import { AsnProp, AsnPropTypes, AsnIntegerArrayBufferConverter } from "@peculiar/asn1-schema";
import { id_ce } from "../object_identifiers";

/**
 * ```asn1
 * id-ce-policyConstraints OBJECT IDENTIFIER ::=  { id-ce 36 }
 * ```
 */
export const id_ce_policyConstraints = `${id_ce}.36`;

/**
 * ```asn1
 * SkipCerts ::= INTEGER (0..MAX)
 * ```
 */
export type SkipCerts = ArrayBuffer;

/**
 * ```asn1
 * PolicyConstraints ::= SEQUENCE {
 *   requireExplicitPolicy           [0] SkipCerts OPTIONAL,
 *   inhibitPolicyMapping            [1] SkipCerts OPTIONAL }
 * ```
 */
export class PolicyConstraints {
  @AsnProp({
    type: AsnPropTypes.Integer,
    context: 0,
    implicit: true,
    optional: true,
    converter: AsnIntegerArrayBufferConverter,
  })
  public requireExplicitPolicy?: SkipCerts;

  @AsnProp({
    type: AsnPropTypes.Integer,
    context: 1,
    implicit: true,
    optional: true,
    converter: AsnIntegerArrayBufferConverter,
  })
  public inhibitPolicyMapping?: SkipCerts;

  constructor(params: Partial<PolicyConstraints> = {}) {
    Object.assign(this, params);
  }
}

import { AsnProp, AsnPropTypes } from "@peculiar/asn1-schema";
import { id_ce } from "../object_identifiers";

/**
 * ```asn1
 * id-ce-basicConstraints OBJECT IDENTIFIER ::=  { id-ce 19 }
 * ```
 */
export const id_ce_basicConstraints = `${id_ce}.19`;

/**
 * ```asn1
 * BasicConstraints ::= SEQUENCE {
 *     cA                      BOOLEAN DEFAULT FALSE,
 *     pathLenConstraint       INTEGER (0..MAX) OPTIONAL }
 * ```
 */
export class BasicConstraints {
  @AsnProp({ type: AsnPropTypes.Boolean, defaultValue: false })
  public cA = false;

  @AsnProp({ type: AsnPropTypes.Integer, optional: true })
  public pathLenConstraint?: number;

  constructor(params: Partial<BasicConstraints> = {}) {
    Object.assign(this, params);
  }
}

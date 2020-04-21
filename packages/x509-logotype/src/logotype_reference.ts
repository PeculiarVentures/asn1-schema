import { AsnProp, AsnPropTypes } from "@peculiar/asn1-schema";
import { HashAlgAndValue } from "./hash_alg_and_value";

/**
 * ```
 * LogotypeReference ::= SEQUENCE {
 *   refStructHash   SEQUENCE SIZE (1..MAX) OF HashAlgAndValue,
 *   refStructURI    SEQUENCE SIZE (1..MAX) OF IA5String }
 *                      -- Places to get the same "LTD" file
 * ```
 */
export class LogotypeReference {

  @AsnProp({ type: HashAlgAndValue, repeated: "sequence" })
  public refStructHash: HashAlgAndValue[] = []

  @AsnProp({ type: AsnPropTypes.IA5String, repeated: "sequence" })
  public refStructURI: string[] = []

  constructor(params: Partial<LogotypeReference> = {}) {
    Object.assign(this, params);
  }
}
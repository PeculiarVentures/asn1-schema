import { AsnProp, AsnPropTypes } from "@peculiar/asn1-schema";
import { HashAlgAndValue } from "./hash_alg_and_value";

/**
 * ```
 * LogotypeDetails ::= SEQUENCE {
 *   mediaType       IA5String, -- MIME media type name and optional
 *                              -- parameters
 *   logotypeHash    SEQUENCE SIZE (1..MAX) OF HashAlgAndValue,
 *   logotypeURI     SEQUENCE SIZE (1..MAX) OF IA5String }
 * ```
 */
export class LogotypeDetails {

  @AsnProp({ type: AsnPropTypes.IA5String })
  public mediaType = "";

  @AsnProp({ type: HashAlgAndValue, repeated: "sequence" })
  public logotypeHash: HashAlgAndValue[] = [];

  @AsnProp({ type: AsnPropTypes.IA5String, repeated: "sequence" })
  public logotypeURI: string[] = [];

  constructor(params: Partial<LogotypeDetails> = {}) {
    Object.assign(this, params);
  }
}
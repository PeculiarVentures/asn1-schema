import { id_ce } from "../object_identifiers";
import { KeyIdentifier } from "./authority_key_identifier";

/**
 * ```asn1
 * id-ce-subjectKeyIdentifier OBJECT IDENTIFIER ::=  { id-ce 14 }
 * ```
 */
export const id_ce_subjectKeyIdentifier = `${id_ce}.14`;

/**
 * ```asn1
 * SubjectKeyIdentifier ::= KeyIdentifier
 * ```
 */
export class SubjectKeyIdentifier extends KeyIdentifier {}

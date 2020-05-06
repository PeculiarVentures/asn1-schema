import { AsnType, AsnTypeTypes } from "@peculiar/asn1-schema";
import { GeneralNames } from "../general_names";
import { id_ce } from "../object_identifiers";

/**
 * ```
 * id-ce-subjectAltName OBJECT IDENTIFIER ::=  { id-ce 17 }
 * ```
 */
export const id_ce_subjectAltName = `${id_ce}.17`;

/**
 * ```
 * SubjectAltName ::= GeneralNames
 * ```
 */
@AsnType({ type: AsnTypeTypes.Sequence })
export class SubjectAlternativeName extends GeneralNames { }

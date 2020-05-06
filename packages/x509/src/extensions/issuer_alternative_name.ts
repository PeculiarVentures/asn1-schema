import { AsnType, AsnTypeTypes } from "@peculiar/asn1-schema";
import { GeneralNames } from "../general_names";
import { id_ce } from "../object_identifiers";

/**
 * ```
 * id-ce-issuerAltName OBJECT IDENTIFIER ::=  { id-ce 18 }
 * ```
 */
export const id_ce_issuerAltName = `${id_ce}.18`;

/**
 * ```
 * IssuerAltName ::= GeneralNames
 * ```
 */
@AsnType({ type: AsnTypeTypes.Sequence })
export class IssueAlternativeName extends GeneralNames { }

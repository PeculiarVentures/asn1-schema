import { AsnType, AsnTypeTypes } from "@peculiar/asn1-schema";
import { GeneralNames } from "../general_names";
import { id_ce } from "../object_identifiers";

/**
 * ```
 * id-ce-certificateIssuer   OBJECT IDENTIFIER ::= { id-ce 29 }
 * ```
 */
export const id_ce_certificateIssuer = `${id_ce}.29`;

/**
 * ```
 * CertificateIssuer ::=     GeneralNames
 * ```
 */
@AsnType({ type: AsnTypeTypes.Sequence })
export class CertificateIssuer extends GeneralNames { }

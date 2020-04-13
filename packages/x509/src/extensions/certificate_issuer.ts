import { AsnProp, AsnType, AsnTypeTypes } from "@peculiar/asn1-schema";
import { GeneralName } from "../general_name";
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
export class CertificateIssuer extends GeneralNames { }

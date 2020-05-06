import { id_pkix } from "@peculiar/asn1-x509";

/**
 * Arc for QC personal data attributes
 * ```
 * id-pda  OBJECT IDENTIFIER ::= { id-pkix 9 }
 * ```
 */
export const id_pda = `${id_pkix}.9`;

/**
 * Arc for QC statements
 * ```
 * id-qcs  OBJECT IDENTIFIER ::= { id-pkix 11 }
 * ```
 */
export const id_qcs = `${id_pkix}.11`;

import { id_pkix } from "@peculiar/asn1-x509";

/**
 * Logotype Extension OID
 * ```asn1
 * id-pe-logotype  OBJECT IDENTIFIER  ::=
 * { iso(1) identified-organization(3) dod(6) internet(1)
 *   security(5) mechanisms(5) pkix(7) id-pe(1) 12 }
 * ```
 */
export const id_pe_logotype = "1.3.6.1.5.5.7.1.12";

/**
 * ```asn1
 * id-logo OBJECT IDENTIFIER ::= { id-pkix 20 }
 * ```
 */
export const id_logo = `${id_pkix}.20`;

/**
 * Loyalty logotype
 * ```asn1
 * id-logo-loyalty    OBJECT IDENTIFIER ::= { id-logo 1 }
 * ```
 */
export const id_logo_loyalty = `${id_logo}.1`;

/**
 * Certificate Background logotype
 * ```asn1
 * id-logo-background OBJECT IDENTIFIER ::= { id-logo 2 }
 * ```
 */
export const id_logo_background = `${id_logo}.2`;

/**
 * Certificate Image Logotype
 * ```asn1
 * id-logo-certImage  OBJECT IDENTIFIER  ::= { id-logo 3 }
 * ```
 */
export const id_logo_certImage = `${id_logo}.3`;

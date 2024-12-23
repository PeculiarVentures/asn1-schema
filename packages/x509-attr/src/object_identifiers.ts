import { id_pe, id_ce, id_pkix } from "@peculiar/asn1-x509";

/**
 * ```asn1
 * id-pe-ac-auditIdentity       OBJECT IDENTIFIER ::= { id-pe 4 }
 * ```
 */
export const id_pe_ac_auditIdentity = `${id_pe}.4`;

/**
 * ```asn1
 * id-pe-aaControls             OBJECT IDENTIFIER ::= { id-pe 6 }
 * ```
 */
export const id_pe_aaControls = `${id_pe}.6`;

/**
 * ```asn1
 * id-pe-ac-proxying            OBJECT IDENTIFIER ::= { id-pe 10 }
 * ```
 */
export const id_pe_ac_proxying = `${id_pe}.10`;

/**
 * ```asn1
 * id-ce-targetInformation      OBJECT IDENTIFIER ::= { id-ce 55 }
 * ```
 */
export const id_ce_targetInformation = `${id_ce}.55`;

/**
 * ```asn1
 * id-aca                       OBJECT IDENTIFIER ::= { id-pkix 10 }
 * ```
 */
export const id_aca = `${id_pkix}.10`;

/**
 * ```asn1
 * id-aca-authenticationInfo    OBJECT IDENTIFIER ::= { id-aca 1 }
 * ```
 */
export const id_aca_authenticationInfo = `${id_aca}.1`;

/**
 * ```asn1
 * id-aca-accessIdentity        OBJECT IDENTIFIER ::= { id-aca 2 }
 * ```
 */
export const id_aca_accessIdentity = `${id_aca}.2`;

/**
 * ```asn1
 * id-aca-chargingIdentity      OBJECT IDENTIFIER ::= { id-aca 3 }
 * ```
 */
export const id_aca_chargingIdentity = `${id_aca}.3`;

/**
 * ```asn1
 * id-aca-group                 OBJECT IDENTIFIER ::= { id-aca 4 }
 * ```
 */
export const id_aca_group = `${id_aca}.4`;

// -- { id-aca 5 } is reserved

/**
 * ```asn1
 * id-aca-encAttrs              OBJECT IDENTIFIER ::= { id-aca 6 }
 * ```
 */
export const id_aca_encAttrs = `${id_aca}.6`;

/**
 * ```asn1
 * id-at   OBJECT IDENTIFIER ::= { joint-iso-ccitt(2) ds(5) 4 }
 * ```
 */
export const id_at = "2.5.4";

/**
 * ```asn1
 * id-at-role                   OBJECT IDENTIFIER ::= { id-at 72}
 * ```
 */
export const id_at_role = `${id_at}.72`;

/**
 * ```asn1
 * id-at-clearance              OBJECT IDENTIFIER ::=
 *     { joint-iso-ccitt(2) ds(5) module(1)
 *       selected-attribute-types(5) clearance (55) }
 * ```
 */
export const id_at_clearance = "2.5.1.5.55";

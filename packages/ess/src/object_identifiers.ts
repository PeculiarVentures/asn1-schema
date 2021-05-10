import { id_smime } from '@peculiar/asn1-pkcs9';

/**
 * ExtendedSecurityServices
 *      { iso(1) member-body(2) us(840) rsadsi(113549)
 *        pkcs(1) pkcs-9(9) smime(16) modules(0) ess(2) }
 */
export const id_ess = `${id_smime}.0.2`;

export const id_aa = `${id_smime}.2`;

/**
 * ```
 * id-aa-receiptRequest OBJECT IDENTIFIER ::= { iso(1) member-body(2)
 *     us(840) rsadsi(113549) pkcs(1) pkcs-9(9) smime(16) id-aa(2) 1}
 * ```
 */
export const id_aa_receiptRequest = `${id_aa}.1`;

/**
 * ```
 * id-aa-contentIdentifier OBJECT IDENTIFIER ::= { iso(1) member-body(2)
 *     us(840) rsadsi(113549) pkcs(1) pkcs-9(9) smime(16) id-aa(2) 7}
 * ```
 */
export const id_aa_contentIdentifier = `${id_aa}.7`;

/**
 * ```
 * id-aa-msgSigDigest OBJECT IDENTIFIER ::= { iso(1) member-body(2)
 *     us(840) rsadsi(113549) pkcs(1) pkcs-9(9) smime(16) id-aa(2) 5}
 * ```
 */
export const id_aa_msgSigDigest = `${id_aa}.5`;

/**
 * ```
 * id-aa-contentHint OBJECT IDENTIFIER ::= { iso(1) member-body(2) us(840)
 *     rsadsi(113549) pkcs(1) pkcs-9(9) smime(16) id-aa(2) 4}
 * ```
 */
export const id_aa_contentHint = `${id_aa}.4`;

/**
 * ```
 * id-aa-contentReference   OBJECT IDENTIFIER ::= { iso(1) member-body(2)
 *     us(840) rsadsi(113549) pkcs(1) pkcs-9(9) smime(16) id-aa(2) 10 }
 * ```
 */
export const id_aa_contentReference = `${id_aa}.10`;

/**
 * ```
 * id-aa-securityLabel    OBJECT IDENTIFIER ::= { iso(1) member-body(2)
 *     us(840) rsadsi(113549) pkcs(1) pkcs-9(9) smime(16) id-aa(2) 2 }
 * ```
 */
export const id_aa_securityLabel = `${id_aa}.2`;

/**
 * ```
 * id-aa-equivalentLabels OBJECT IDENTIFIER ::= { iso(1) member-body(2)
 *         us(840) rsadsi(113549) pkcs(1) pkcs-9(9) smime(16) id-aa(2) 9}
 * ```
 */
export const id_aa_equivalentLabels = `${id_aa}.9`;

/**
 * ```
 * id-aa-mlExpandHistory OBJECT IDENTIFIER ::= { iso(1) member-body(2)
 *     us(840) rsadsi(113549) pkcs(1) pkcs-9(9) smime(16) id-aa(2) 3}
 * ```
 */
export const id_aa_mlExpandHistory = `${id_aa}.3`;

/**
 * ```
 * id-aa-signingCertificate OBJECT IDENTIFIER ::= { iso(1)
 *     member-body(2) us(840) rsadsi(113549) pkcs(1) pkcs9(9)
 *     smime(16) id-aa(2) 12 }
 * ```
 */
export const id_aa_signingCertificate = `${id_aa}.12`;

export const id_ct = `${id_smime}.1`;

/**
 * ```
 * id-ct-receipt OBJECT IDENTIFIER ::= { iso(1) member-body(2) us(840)
 *    rsadsi(113549) pkcs(1) pkcs-9(9) smime(16) id-ct(1) 1}
 * ```
 */
export const id_ct_receipt = `${id_ct}.1`;

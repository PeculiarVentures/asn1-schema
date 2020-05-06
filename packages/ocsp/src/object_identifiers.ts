import { id_kp, id_ad_ocsp } from "@peculiar/asn1-x509";

/**
 * ```
 * id-kp-OCSPSigning            OBJECT IDENTIFIER ::= { id-kp 9 }
 * ```
 */
export const id_kp_OCSPSigning = `${id_kp}.9`;

/**
 * ```
 * id-pkix-ocsp                 OBJECT IDENTIFIER ::= id-ad-ocsp
 * ```
 */
export const id_pkix_ocsp = `${id_ad_ocsp}`;
/**
 * ```
 * id-pkix-ocsp-basic           OBJECT IDENTIFIER ::= { id-pkix-ocsp 1 }
 * ```
 */
export const id_pkix_ocsp_basic = `${id_pkix_ocsp}.1`;

/**
 * ```
 * id-pkix-ocsp-nonce           OBJECT IDENTIFIER ::= { id-pkix-ocsp 2 }
 * ```
 */
export const id_pkix_ocsp_nonce = `${id_pkix_ocsp}.2`;

/**
 * ```
 * id-pkix-ocsp-crl             OBJECT IDENTIFIER ::= { id-pkix-ocsp 3 }
 * ```
 */
export const id_pkix_ocsp_crl = `${id_pkix_ocsp}.3`;

/**
 * ```
 * id-pkix-ocsp-response        OBJECT IDENTIFIER ::= { id-pkix-ocsp 4 }
 * ```
 */
export const id_pkix_ocsp_response = `${id_pkix_ocsp}.4`;

/**
 * ```
 * id-pkix-ocsp-nocheck         OBJECT IDENTIFIER ::= { id-pkix-ocsp 5 }
 * ```
 */
export const id_pkix_ocsp_nocheck = `${id_pkix_ocsp}.5`;

/**
 * ```
 * id-pkix-ocsp-archive-cutoff  OBJECT IDENTIFIER ::= { id-pkix-ocsp 6 }
 * ```
 */
export const id_pkix_ocsp_archive_cutoff = `${id_pkix_ocsp}.6`;

/**
 * ```
 * id-pkix-ocsp-service-locator OBJECT IDENTIFIER ::= { id-pkix-ocsp 7 }
 * ```
 */
export const id_pkix_ocsp_service_locator = `${id_pkix_ocsp}.7`;

/**
 * ```
 * id-pkix-ocsp-pref-sig-algs   OBJECT IDENTIFIER ::= { id-pkix-ocsp 8 }
 * ```
 */
export const id_pkix_ocsp_pref_sig_algs = `${id_pkix_ocsp}.8`;

/**
 * ```
 * id-pkix-ocsp-extended-revoke OBJECT IDENTIFIER ::= { id-pkix-ocsp 9 }
 * ```
 */
export const id_pkix_ocsp_extended_revoke = `${id_pkix_ocsp}.9`;

/**
 * Object identifiers for NIST FIPS 204 (ML-DSA) and FIPS 205 (SLH-DSA)
 * pure signature algorithms, registered in the NIST Computer Security
 * Objects Register (CSOR).
 *
 * Per FIPS 204 §5, FIPS 205 §9, and NIST CSOR, the AlgorithmIdentifier
 * for pure ML-DSA and SLH-DSA does NOT carry parameters (the parameters
 * field is ABSENT, not NULL) — the same encoding convention used by
 * Ed25519 (RFC 8410).
 *
 * References:
 *   FIPS 204: https://nvlpubs.nist.gov/nistpubs/FIPS/NIST.FIPS.204.pdf
 *   FIPS 205: https://nvlpubs.nist.gov/nistpubs/FIPS/NIST.FIPS.205.pdf
 *   NIST CSOR: https://csrc.nist.gov/projects/computer-security-objects-register/algorithm-registration
 */

/**
 * ```asn1
 * sigAlgs OBJECT IDENTIFIER ::= {
 *   joint-iso-itu-t(2) country(16) us(840) organization(1) gov(101)
 *   csor(3) nistAlgorithm(4) 3 }
 * ```
 */
const id_sigAlgs = "2.16.840.1.101.3.4.3";

// ----- FIPS 204 — ML-DSA (pure) -----

/**
 * ```asn1
 * id-ml-dsa-44 OBJECT IDENTIFIER ::= { sigAlgs 17 }
 * ```
 */
export const id_ml_dsa_44 = `${id_sigAlgs}.17`;

/**
 * ```asn1
 * id-ml-dsa-65 OBJECT IDENTIFIER ::= { sigAlgs 18 }
 * ```
 */
export const id_ml_dsa_65 = `${id_sigAlgs}.18`;

/**
 * ```asn1
 * id-ml-dsa-87 OBJECT IDENTIFIER ::= { sigAlgs 19 }
 * ```
 */
export const id_ml_dsa_87 = `${id_sigAlgs}.19`;

// ----- FIPS 205 — SLH-DSA (pure) -----

/**
 * ```asn1
 * id-slh-dsa-sha2-128s OBJECT IDENTIFIER ::= { sigAlgs 20 }
 * ```
 */
export const id_slh_dsa_sha2_128s = `${id_sigAlgs}.20`;

/**
 * ```asn1
 * id-slh-dsa-sha2-128f OBJECT IDENTIFIER ::= { sigAlgs 21 }
 * ```
 */
export const id_slh_dsa_sha2_128f = `${id_sigAlgs}.21`;

/**
 * ```asn1
 * id-slh-dsa-sha2-192s OBJECT IDENTIFIER ::= { sigAlgs 22 }
 * ```
 */
export const id_slh_dsa_sha2_192s = `${id_sigAlgs}.22`;

/**
 * ```asn1
 * id-slh-dsa-sha2-192f OBJECT IDENTIFIER ::= { sigAlgs 23 }
 * ```
 */
export const id_slh_dsa_sha2_192f = `${id_sigAlgs}.23`;

/**
 * ```asn1
 * id-slh-dsa-sha2-256s OBJECT IDENTIFIER ::= { sigAlgs 24 }
 * ```
 */
export const id_slh_dsa_sha2_256s = `${id_sigAlgs}.24`;

/**
 * ```asn1
 * id-slh-dsa-sha2-256f OBJECT IDENTIFIER ::= { sigAlgs 25 }
 * ```
 */
export const id_slh_dsa_sha2_256f = `${id_sigAlgs}.25`;

/**
 * ```asn1
 * id-slh-dsa-shake-128s OBJECT IDENTIFIER ::= { sigAlgs 26 }
 * ```
 */
export const id_slh_dsa_shake_128s = `${id_sigAlgs}.26`;

/**
 * ```asn1
 * id-slh-dsa-shake-128f OBJECT IDENTIFIER ::= { sigAlgs 27 }
 * ```
 */
export const id_slh_dsa_shake_128f = `${id_sigAlgs}.27`;

/**
 * ```asn1
 * id-slh-dsa-shake-192s OBJECT IDENTIFIER ::= { sigAlgs 28 }
 * ```
 */
export const id_slh_dsa_shake_192s = `${id_sigAlgs}.28`;

/**
 * ```asn1
 * id-slh-dsa-shake-192f OBJECT IDENTIFIER ::= { sigAlgs 29 }
 * ```
 */
export const id_slh_dsa_shake_192f = `${id_sigAlgs}.29`;

/**
 * ```asn1
 * id-slh-dsa-shake-256s OBJECT IDENTIFIER ::= { sigAlgs 30 }
 * ```
 */
export const id_slh_dsa_shake_256s = `${id_sigAlgs}.30`;

/**
 * ```asn1
 * id-slh-dsa-shake-256f OBJECT IDENTIFIER ::= { sigAlgs 31 }
 * ```
 */
export const id_slh_dsa_shake_256f = `${id_sigAlgs}.31`;

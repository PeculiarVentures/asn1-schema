/**
 * ```asn
 * id-ct-contentInfo OBJECT IDENTIFIER ::= { iso(1) member-body(2)
 *   us(840) rsadsi(113549) pkcs(1) pkcs9(9) smime(16) ct(1) 6 }
 * ```
 */
export const id_ct_contentInfo = "1.2.840.113549.1.9.16.1.6";
/**
 * ```asn
 * id-data OBJECT IDENTIFIER ::= { iso(1) member-body(2)
 *   us(840) rsadsi(113549) pkcs(1) pkcs7(7) 1 }
 * ```
 */
export const id_data = "1.2.840.113549.1.7.1";

/**
 * ```asn
 * id-signedData OBJECT IDENTIFIER ::= { iso(1) member-body(2)
 *   us(840) rsadsi(113549) pkcs(1) pkcs7(7) 2 }
 * ```
 */
export const id_signedData = "1.2.840.113549.1.7.2";

/**
 * ```asn
 * id-envelopedData OBJECT IDENTIFIER ::= { iso(1) member-body(2)
 *   us(840) rsadsi(113549) pkcs(1) pkcs7(7) 3 }
 * ```
 */
export const id_envelopedData = "1.2.840.113549.1.7.3";

/**
 * ```asn
 * id-digestedData OBJECT IDENTIFIER ::= { iso(1) member-body(2)
 *   us(840) rsadsi(113549) pkcs(1) pkcs7(7) 5 }
 * ```
 */
export const id_digestedData = "1.2.840.113549.1.7.5";

/**
 * ```asn
 * id-encryptedData OBJECT IDENTIFIER ::= { iso(1) member-body(2)
 *   us(840) rsadsi(113549) pkcs(1) pkcs7(7) 6 }
 * ```
 */
export const id_encryptedData = "1.2.840.113549.1.7.6";

/**
 * ```asn
 * id-ct-authData OBJECT IDENTIFIER ::= { iso(1) member-body(2)
 *   us(840) rsadsi(113549) pkcs(1) pkcs-9(9) smime(16) ct(1) 2 }
 * ```
 */
export const id_authData = "1.2.840.113549.1.9.16.1.2";

/**
 * AES algorithm identifier arc (RFC 3565).
 * ```asn
 * aes OBJECT IDENTIFIER ::= { joint-iso-itu-t(2) country(16) us(840)
 *   organization(1) gov(101) csor(3) nistAlgorithm(4) 1 }
 * ```
 */
export const id_aes = "2.16.840.1.101.3.4.1";

/**
 * AES-128-CBC (RFC 3565). AlgorithmIdentifier parameters contain a
 * 16-octet IV encoded as an OCTET STRING.
 * ```asn
 * id-aes128-CBC OBJECT IDENTIFIER ::= { aes 2 }
 * ```
 */
export const id_aes128_CBC = `${id_aes}.2`;

/**
 * AES-192-CBC (RFC 3565). AlgorithmIdentifier parameters contain a
 * 16-octet IV encoded as an OCTET STRING.
 * ```asn
 * id-aes192-CBC OBJECT IDENTIFIER ::= { aes 22 }
 * ```
 */
export const id_aes192_CBC = `${id_aes}.22`;

/**
 * AES-256-CBC (RFC 3565). AlgorithmIdentifier parameters contain a
 * 16-octet IV encoded as an OCTET STRING.
 * ```asn
 * id-aes256-CBC OBJECT IDENTIFIER ::= { aes 42 }
 * ```
 */
export const id_aes256_CBC = `${id_aes}.42`;

/**
 * AES-128 key wrap (RFC 3565). AlgorithmIdentifier parameters are absent.
 * ```asn
 * id-aes128-wrap OBJECT IDENTIFIER ::= { aes 5 }
 * ```
 */
export const id_aes128_wrap = `${id_aes}.5`;

/**
 * AES-192 key wrap (RFC 3565). AlgorithmIdentifier parameters are absent.
 * ```asn
 * id-aes192-wrap OBJECT IDENTIFIER ::= { aes 25 }
 * ```
 */
export const id_aes192_wrap = `${id_aes}.25`;

/**
 * AES-256 key wrap (RFC 3565). AlgorithmIdentifier parameters are absent.
 * ```asn
 * id-aes256-wrap OBJECT IDENTIFIER ::= { aes 45 }
 * ```
 */
export const id_aes256_wrap = `${id_aes}.45`;

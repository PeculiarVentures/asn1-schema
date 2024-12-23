import { id_bagtypes } from "../object_identifiers";

/**
 * ```asn1
 * keyBag BAG-TYPE ::=
 *      {KeyBag              IDENTIFIED BY {bagtypes 1}}
 * ```
 */
export const id_keyBag = `${id_bagtypes}.1`;

/**
 * ```asn1
 * pkcs8ShroudedKeyBag BAG-TYPE ::=
 *     {PKCS8ShroudedKeyBag IDENTIFIED BY {bagtypes 2}}
 * ```
 */
export const id_pkcs8ShroudedKeyBag = `${id_bagtypes}.2`;

/**
 * ```asn1
 * certBag BAG-TYPE ::=
 *     {CertBag             IDENTIFIED BY {bagtypes 3}}
 * ```
 */
export const id_certBag = `${id_bagtypes}.3`;

/**
 * ```asn1
 * crlBag BAG-TYPE ::=
 *     {CRLBag              IDENTIFIED BY {bagtypes 4}}
 * ```
 */
export const id_CRLBag = `${id_bagtypes}.4`;

/**
 * ```asn1
 * secretBag BAG-TYPE ::=
 *     {SecretBag           IDENTIFIED BY {bagtypes 5}}
 * ```
 */
export const id_SecretBag = `${id_bagtypes}.5`;

/**
 * ```asn1
 * safeContentsBag BAG-TYPE ::=
 *     {SafeContents        IDENTIFIED BY {bagtypes 6}}
 * ```
 */
export const id_SafeContents = `${id_bagtypes}.6`;

/**
 * ```asn1
 * pkcs-9 OBJECT IDENTIFIER ::= {iso(1) member-body(2) us(840)
 *   rsadsi(113549) pkcs(1) 9}
 * ```
 */
export const id_pkcs_9 = "1.2.840.113549.1.9";

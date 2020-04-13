/**
 * ```
 * id-pkix  OBJECT IDENTIFIER  ::=
 *               { iso(1) identified-organization(3) dod(6) internet(1)
 *                       security(5) mechanisms(5) pkix(7) }
 * ```
 */
export const id_pkix = "1.3.6.1.5.5.7";

// -- PKIX arcs

/**
 * ```
 * id-pe OBJECT IDENTIFIER ::= { id-pkix 1 }
 *         -- arc for private certificate extensions
 * ```
 */
export const id_pe = `${id_pkix}.1`;

/**
 * ```
 * id-qt OBJECT IDENTIFIER ::= { id-pkix 2 }
 *         -- arc for policy qualifier types
 * ```
 */
export const id_qt = `${id_pkix}.2`;

/**
 * ```
 * id-kp OBJECT IDENTIFIER ::= { id-pkix 3 }
 *         -- arc for extended key purpose OIDS
 * ```
 */
export const id_kp = `${id_pkix}.3`;

/**
 * ```
 * id-ad OBJECT IDENTIFIER ::= { id-pkix 48 }
 *         -- arc for access descriptors
 * ```
 */
export const id_ad = `${id_pkix}.48`;

// -- policyQualifierIds for Internet policy qualifiers

/**
 * ```
 * id-qt-cps      OBJECT IDENTIFIER ::=  { id-qt 1 }
 *       -- OID for CPS qualifier
 * ```
 */
export const id_qt_csp = `${id_qt}.1`;

/**
 * ```
 * id-qt-unotice  OBJECT IDENTIFIER ::=  { id-qt 2 }
 *       -- OID for user notice qualifier
 * ```
 */
export const id_qt_unotice = `${id_qt}.2`;

// -- access descriptor definitions

/**
 * ```
 * id-ad-ocsp         OBJECT IDENTIFIER ::= { id-ad 1 }
 * ```
 */
export const id_ad_ocsp = `${id_ad}.1`;

/**
 * ```
 * id-ad-caIssuers    OBJECT IDENTIFIER ::= { id-ad 2 }
 * ```
 */
export const id_ad_caIssuers = `${id_ad}.2`;

/**
 * ```
 * id-ad-timeStamping OBJECT IDENTIFIER ::= { id-ad 3 }
 * ```
 */
export const id_ad_timeStamping = `${id_ad}.3`;

/**
 * ```
 * id-ad-caRepository OBJECT IDENTIFIER ::= { id-ad 5 }
 * ```
 */
export const id_ad_caRepository = `${id_ad}.5`;

/**
 * ```
 * id-ce OBJECT IDENTIFIER  ::=  {joint-iso-ccitt(2) ds(5) 29}
 * ```
 */
export const id_ce = "2.5.29";
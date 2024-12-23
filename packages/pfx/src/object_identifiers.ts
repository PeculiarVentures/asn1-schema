/**
 * ```
 * rsadsi  OBJECT IDENTIFIER ::= {iso(1) member-body(2) us(840)
 *   rsadsi(113549)}
 * ```
 */
export const id_rsadsi = "1.2.840.113549";

/**
 * ```
 * pkcs    OBJECT IDENTIFIER ::= {rsadsi pkcs(1)}
 * ```
 */
export const id_pkcs = `${id_rsadsi}.1`;

/**
 *
 * ```
 * pkcs-12 OBJECT IDENTIFIER ::= {pkcs 12}
 * ```
 */
export const id_pkcs_12 = `${id_pkcs}.12`;

/**
 * ```
 * pkcs-12PbeIds OBJECT IDENTIFIER ::= {pkcs-12 1}
 */
export const id_pkcs_12PbeIds = `${id_pkcs_12}.1`;

/**
 * ```
 * pbeWithSHAAnd128BitRC4          OBJECT IDENTIFIER ::= {pkcs-12PbeIds 1}
 * ```
 */
export const id_pbeWithSHAAnd128BitRC4 = `${id_pkcs_12PbeIds}.1`;

/**
 * ```
 * pbeWithSHAAnd40BitRC4           OBJECT IDENTIFIER ::= {pkcs-12PbeIds 2}
 * ```
 */
export const id_pbeWithSHAAnd40BitRC4 = `${id_pkcs_12PbeIds}.2`;

/**
 * ```
 * pbeWithSHAAnd3-KeyTripleDES-CBC OBJECT IDENTIFIER ::= {pkcs-12PbeIds 3}
 * ```
 */
export const id_pbeWithSHAAnd3_KeyTripleDES_CBC = `${id_pkcs_12PbeIds}.3`;

/**
 * ```
 * pbeWithSHAAnd2-KeyTripleDES-CBC OBJECT IDENTIFIER ::= {pkcs-12PbeIds 4}
 * ```
 */
export const id_pbeWithSHAAnd2_KeyTripleDES_CBC = `${id_pkcs_12PbeIds}.4`;

/**
 * ```
 * pbeWithSHAAnd128BitRC2-CBC      OBJECT IDENTIFIER ::= {pkcs-12PbeIds 5}
 * ```
 */
export const id_pbeWithSHAAnd128BitRC2_CBC = `${id_pkcs_12PbeIds}.5`;

/**
 * ```
 * pbewithSHAAnd40BitRC2-CBC       OBJECT IDENTIFIER ::= {pkcs-12PbeIds 6}
 * ```
 */
export const id_pbewithSHAAnd40BitRC2_CBC = `${id_pkcs_12PbeIds}.6`;

/**
 * ```
 * bagtypes OBJECT IDENTIFIER ::= {pkcs-12 10 1}
 * ```
 */
export const id_bagtypes = `${id_pkcs_12}.10.1`;

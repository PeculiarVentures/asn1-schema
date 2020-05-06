/**
 * ```
 * id-ecPublicKey OBJECT IDENTIFIER ::= {
 *   iso(1) member-body(2) us(840) ansi-X9-62(10045) keyType(2) 1 }
 * ```
 */
export const id_ecPublicKey = "1.2.840.10045.2.1";

/**
 * ```
 * id-ecDH OBJECT IDENTIFIER ::= {
 *   iso(1) identified-organization(3) certicom(132) schemes(1)
 *   ecdh(12) }
 * ```
 */
export const id_ecDH = "1.3.132.1.12";

/**
 * ```
 * id-ecMQV OBJECT IDENTIFIER ::= {
 *   iso(1) identified-organization(3) certicom(132) schemes(1)
 *   ecmqv(13) }
 * ```
 */
export const id_ecMQV = "1.3.132.1.13";

/**
 * ```
 * ecdsa-with-SHA1 OBJECT IDENTIFIER ::= {
 *   iso(1) member-body(2) us(840) ansi-X9-62(10045) signatures(4) 1 }
 * ```
 */
export const id_ecdsaWithSHA1 = "1.2.840.10045.4.1";

/**
 * ```
 * ecdsa-with-SHA224 OBJECT IDENTIFIER ::= {
 *   iso(1) member-body(2) us(840) ansi-X9-62(10045) signatures(4)
 *   ecdsa-with-SHA2(3) 1 }
 * ```
 */
export const id_ecdsaWithSHA224 = "1.2.840.10045.4.3.1";

/**
 * ```
 * ecdsa-with-SHA256 OBJECT IDENTIFIER ::= {
 *   iso(1) member-body(2) us(840) ansi-X9-62(10045) signatures(4)
 *   ecdsa-with-SHA2(3) 2 }
 * ```
 */
export const id_ecdsaWithSHA256 = "1.2.840.10045.4.3.2";

/**
 * ```
 * ecdsa-with-SHA384 OBJECT IDENTIFIER ::= {
 *   iso(1) member-body(2) us(840) ansi-X9-62(10045) signatures(4)
 *   ecdsa-with-SHA2(3) 3 }
 * ```
 */
export const id_ecdsaWithSHA384 = "1.2.840.10045.4.3.3";

/**
 * ```
 * ecdsa-with-SHA512 OBJECT IDENTIFIER ::= {
 *   iso(1) member-body(2) us(840) ansi-X9-62(10045) signatures(4)
 *   ecdsa-with-SHA2(3) 4 }
 * ```
 */
export const id_ecdsaWithSHA512 = "1.2.840.10045.4.3.4";

// Named Elliptic Curves

/**
 * ```
 * secp192r1 OBJECT IDENTIFIER ::= {
 *   iso(1) member-body(2) us(840) ansi-X9-62(10045) curves(3)
 *   prime(1) 1 }
 * ```
 */
export const id_secp192r1 = "1.2.840.10045.3.1.1";

/**
 * ```
 * sect163k1 OBJECT IDENTIFIER ::= {
 *   iso(1) identified-organization(3) certicom(132) curve(0) 1 }
 * ```
 */
export const id_sect163k1 = "1.3.132.0.1";

/**
 * ```
 * sect163r2 OBJECT IDENTIFIER ::= {
 *   iso(1) identified-organization(3) certicom(132) curve(0) 15 }
 * ```
 */
export const id_sect163r2 = "1.3.132.0.15";

/**
 * ```
 * secp224r1 OBJECT IDENTIFIER ::= {
 *   iso(1) identified-organization(3) certicom(132) curve(0) 33 }
 * ```
 */
export const id_secp224r1 = "1.3.132.0.33";

/**
 * ```
 * sect233k1 OBJECT IDENTIFIER ::= {
 *   iso(1) identified-organization(3) certicom(132) curve(0) 26 }
 * ```
 */
export const id_sect233k1 = "1.3.132.0.26";

/**
 * ```
 * sect233r1 OBJECT IDENTIFIER ::= {
 *   iso(1) identified-organization(3) certicom(132) curve(0) 27 }
 * ```
 */
export const id_sect233r1 = "1.3.132.0.27";

/**
 * ```
 * secp256r1 OBJECT IDENTIFIER ::= {
 *   iso(1) member-body(2) us(840) ansi-X9-62(10045) curves(3)
 *   prime(1) 7 }
 * ```
 */
export const id_secp256r1 = "1.2.840.10045.3.1.7";

/**
 * ```
 * sect283k1 OBJECT IDENTIFIER ::= {
 *   iso(1) identified-organization(3) certicom(132) curve(0) 16 }
 * ```
 */
export const id_sect283k1 = "1.3.132.0.16";

/**
 * ```
 * sect283r1 OBJECT IDENTIFIER ::= {
 *   iso(1) identified-organization(3) certicom(132) curve(0) 17 }
 * ```
 */
export const id_sect283r1 = "1.3.132.0.17";

/**
 * ```
 * secp384r1 OBJECT IDENTIFIER ::= {
 *   iso(1) identified-organization(3) certicom(132) curve(0) 34 }
 * ```
 */
export const id_secp384r1 = "1.3.132.0.34";

/**
 * ```
 * sect409k1 OBJECT IDENTIFIER ::= {
 *   iso(1) identified-organization(3) certicom(132) curve(0) 36 }
 * ```
 */
export const id_sect409k1 = "1.3.132.0.36";

/**
 * ```
 * sect409r1 OBJECT IDENTIFIER ::= {
 *   iso(1) identified-organization(3) certicom(132) curve(0) 37 }
 * ```
 */
export const id_sect409r1 = "1.3.132.0.37";

/**
 * ```
 * secp521r1 OBJECT IDENTIFIER ::= {
 *   iso(1) identified-organization(3) certicom(132) curve(0) 35 }
 * ```
 */
export const id_secp521r1 = "1.3.132.0.35";

/**
 * ```
 * sect571k1 OBJECT IDENTIFIER ::= {
 *   iso(1) identified-organization(3) certicom(132) curve(0) 38 }
 * ```
 */
export const id_sect571k1 = "1.3.132.0.38";

/**
 * ```
 * sect571r1 OBJECT IDENTIFIER ::= {
 *   iso(1) identified-organization(3) certicom(132) curve(0) 39 }
 * ```
 */
export const id_sect571r1 = "1.3.132.0.39";

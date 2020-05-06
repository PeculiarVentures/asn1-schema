import { OctetString } from "@peculiar/asn1-schema";

/**
 * ```
 * id-messageDigest OBJECT IDENTIFIER ::= { iso(1) member-body(2)
 *   us(840) rsadsi(113549) pkcs(1) pkcs9(9) 4 }
 * ```
 */
export const id_messageDigest = "1.2.840.113549.1.9.4";

/**
 * ```
 * MessageDigest ::= OCTET STRING
 * ```
 */
export class MessageDigest extends OctetString { }

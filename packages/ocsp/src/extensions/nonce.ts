import { OctetString } from "@peculiar/asn1-schema";

// re-ocsp-nonce EXTENSION ::= { SYNTAX OCTET STRING IDENTIFIED
//   BY id-pkix-ocsp-nonce }

/**
 * ```
 * Nonce ::= OCTET STRING
 * ```
 */
export class Nonce extends OctetString { }
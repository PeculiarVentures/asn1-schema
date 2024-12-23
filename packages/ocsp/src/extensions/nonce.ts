import { OctetString } from "@peculiar/asn1-schema";

// re-ocsp-nonce EXTENSION ::= { SYNTAX OCTET STRING IDENTIFIED
//   BY id-pkix-ocsp-nonce }

/**
 * ```asn1
 * Nonce ::= OCTET STRING
 * ```
 */
export class Nonce extends OctetString {}

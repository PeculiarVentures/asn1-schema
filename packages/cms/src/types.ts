import { AlgorithmIdentifier } from "@peculiar/asn1-x509";

/**
 * ```
 * ContentType ::= OBJECT IDENTIFIER
 * ```
 */
export type ContentType = string;

/**
 * ```
 * CMSVersion ::= INTEGER  { v0(0), v1(1), v2(2), v3(3), v4(4), v5(5) }
 * ```
 */
export type CMSVersion = number;

/**
 * ```
 * DigestAlgorithmIdentifier ::= AlgorithmIdentifier
 * ```
 */
export class DigestAlgorithmIdentifier extends AlgorithmIdentifier { }

/**
 * ```
 * SignatureAlgorithmIdentifier ::= AlgorithmIdentifier
 * ```
 */
export class SignatureAlgorithmIdentifier extends AlgorithmIdentifier { }

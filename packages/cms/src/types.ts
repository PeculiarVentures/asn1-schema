import { AlgorithmIdentifier } from "@peculiar/asn1-x509";
import { AsnTypeTypes, AsnType } from "@peculiar/asn1-schema";

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
export enum CMSVersion {
  v0 = 0,
  v1 = 1,
  v2 = 2,
  v3 = 3,
  v4 = 4,
  v5 = 5,
}

/**
 * ```
 * DigestAlgorithmIdentifier ::= AlgorithmIdentifier
 * ```
 */
@AsnType({ type: AsnTypeTypes.Sequence })
export class DigestAlgorithmIdentifier extends AlgorithmIdentifier { }

/**
 * ```
 * SignatureAlgorithmIdentifier ::= AlgorithmIdentifier
 * ```
 */
@AsnType({ type: AsnTypeTypes.Sequence })
export class SignatureAlgorithmIdentifier extends AlgorithmIdentifier { }

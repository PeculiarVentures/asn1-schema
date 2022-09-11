import { AlgorithmIdentifier } from "@peculiar/asn1-x509";
import { AsnTypeTypes, AsnType, OctetString } from "@peculiar/asn1-schema";

/**
 * ```asn
 * ContentType ::= OBJECT IDENTIFIER
 * ```
 */
export type ContentType = string;

/**
 * ```asn
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
 * ```asn
 * EncryptedKey ::= OCTET STRING
 * ```
 */
 export type EncryptedKey = OctetString;

/**
 * ```asn
 * DigestAlgorithmIdentifier ::= AlgorithmIdentifier
 * ```
 */
@AsnType({ type: AsnTypeTypes.Sequence })
export class DigestAlgorithmIdentifier extends AlgorithmIdentifier { }

/**
 * ```asn
 * SignatureAlgorithmIdentifier ::= AlgorithmIdentifier
 * ```
 */
@AsnType({ type: AsnTypeTypes.Sequence })
export class SignatureAlgorithmIdentifier extends AlgorithmIdentifier { }

/**
 * ```asn
 * KeyEncryptionAlgorithmIdentifier ::= AlgorithmIdentifier
 * ```
 */
@AsnType({ type: AsnTypeTypes.Sequence })
export class KeyEncryptionAlgorithmIdentifier extends AlgorithmIdentifier { }

/**
 * ```asn
 * ContentEncryptionAlgorithmIdentifier ::= AlgorithmIdentifier
 * ```
 */
@AsnType({ type: AsnTypeTypes.Sequence })
export class ContentEncryptionAlgorithmIdentifier extends AlgorithmIdentifier { }

/**
 * ```asn
 * MessageAuthenticationCodeAlgorithm ::= AlgorithmIdentifier
 * ```
 */
@AsnType({ type: AsnTypeTypes.Sequence })
export class MessageAuthenticationCodeAlgorithm extends AlgorithmIdentifier { }

/**
 * ```asn
 * KeyDerivationAlgorithmIdentifier ::= AlgorithmIdentifier
 * ```
 */
@AsnType({ type: AsnTypeTypes.Sequence })
export class KeyDerivationAlgorithmIdentifier extends AlgorithmIdentifier { }

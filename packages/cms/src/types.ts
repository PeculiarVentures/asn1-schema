import { AlgorithmIdentifier } from "@peculiar/asn1-x509";
import { AsnTypeTypes, AsnType, OctetString } from "@peculiar/asn1-schema";

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
 * EncryptedKey ::= OCTET STRING
 * ```
 */
 export type EncryptedKey = OctetString;

 /**
 * ```
 * EncryptedContent ::= OCTET STRING
 * ```
 */
export type EncryptedContent = OctetString;

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

/**
 * ```
 * KeyEncryptionAlgorithmIdentifier ::= AlgorithmIdentifier
 * ```
 */
@AsnType({ type: AsnTypeTypes.Sequence })
export class KeyEncryptionAlgorithmIdentifier extends AlgorithmIdentifier { }

/**
 * ```
 * ContentEncryptionAlgorithmIdentifier ::= AlgorithmIdentifier
 * ```
 */
@AsnType({ type: AsnTypeTypes.Sequence })
export class ContentEncryptionAlgorithmIdentifier extends AlgorithmIdentifier { }

/**
 * ```
 * MessageAuthenticationCodeAlgorithm ::= AlgorithmIdentifier
 * ```
 */
@AsnType({ type: AsnTypeTypes.Sequence })
export class MessageAuthenticationCodeAlgorithm extends AlgorithmIdentifier { }

/**
 * ```
 * KeyDerivationAlgorithmIdentifier ::= AlgorithmIdentifier
 * ```
 */
@AsnType({ type: AsnTypeTypes.Sequence })
export class KeyDerivationAlgorithmIdentifier extends AlgorithmIdentifier { }

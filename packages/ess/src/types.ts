import { OctetString } from "@peculiar/asn1-schema";

export const ub_ml_expansion_history = 64;

/**
 * ```
 * ESSVersion ::= INTEGER  { v1(1) }
 * ```
 */
export enum ESSVersion {
  v1 = 1,
}

/**
 * ```
 * AllOrFirstTier ::= INTEGER { -- Formerly AllOrNone
 *   allReceipts (0),
 *   firstTierRecipients (1) }
 * ```
 */
export enum AllOrFirstTier {
  allReceipts = 0,
  firstTierRecipients = 1,
}

/**
 * ```
 * ContentIdentifier ::= OCTET STRING
 * ```
 */
export type ContentIdentifier = OctetString;

/**
 * ```
 * MsgSigDigest ::= OCTET STRING
 * ```
 */
export type MsgSigDigest = OctetString;

/**
 * ```
 * Hash ::= OCTET STRING -- SHA1 hash of entire certificate
 * ```
 */
export type Hash = OctetString;

/**
 * ```
 * SecurityClassification ::= INTEGER {
 *   unmarked (0),
 *   unclassified (1),
 *   restricted (2),
 *   confidential (3),
 *   secret (4),
 *   top-secret (5) } (0..ub-integer-options)
 * ```
 */
export enum SecurityClassification {
  unmarked = 0,
  unclassified = 1,
  restricted = 2,
  confidential = 3,
  secret = 4,
  topSecret = 5,
}

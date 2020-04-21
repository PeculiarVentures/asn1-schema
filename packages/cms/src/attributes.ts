import { Time } from "@peculiar/asn1-x509";
import { SignerInfo } from "./signer_info";

export type MessageDigest = ArrayBuffer;

/**
 * ```
 * SigningTime  ::= Time
 * ```
 */
export class SigningTime extends Time { }

/**
 * ```
 * Countersignature ::= SignerInfo
 * ```
 */
export class CounterSignature extends SignerInfo { }

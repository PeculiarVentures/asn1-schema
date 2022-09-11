import { AsnTypeTypes, AsnType } from "@peculiar/asn1-schema";
import { Time } from "@peculiar/asn1-x509";
import { SignerInfo } from "./signer_info";

export type MessageDigest = ArrayBuffer;

/**
 * ```asn
 * SigningTime  ::= Time
 * ```
 */
@AsnType({ type: AsnTypeTypes.Choice })
export class SigningTime extends Time { }

/**
 * ```asn
 * Countersignature ::= SignerInfo
 * ```
 */
@AsnType({ type: AsnTypeTypes.Sequence })
export class CounterSignature extends SignerInfo { }

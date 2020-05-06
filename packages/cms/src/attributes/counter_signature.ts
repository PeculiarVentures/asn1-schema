import { AsnType, AsnTypeTypes } from "@peculiar/asn1-schema";
import { SignerInfo } from "../signer_info";

/**
 * ```
 * id-countersignature OBJECT IDENTIFIER ::= { iso(1) member-body(2)
 *   us(840) rsadsi(113549) pkcs(1) pkcs9(9) 6 }
 * ```
 */
export const id_counterSignature = "1.2.840.113549.1.9.6";

/**
 * ```
 * SigningTime  ::= Time
 * ```
 */
@AsnType({ type: AsnTypeTypes.Sequence })
export class CounterSignature extends SignerInfo { }

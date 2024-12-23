import { Time } from "@peculiar/asn1-x509";
import { AsnTypeTypes, AsnType } from "@peculiar/asn1-schema";

/**
 * ```asn
 * id-signingTime OBJECT IDENTIFIER ::= { iso(1) member-body(2)
 *   us(840) rsadsi(113549) pkcs(1) pkcs9(9) 5 }
 * ```
 */
export const id_signingTime = "1.2.840.113549.1.9.5";

/**
 * ```asn
 * SigningTime  ::= Time
 * ```
 */
@AsnType({ type: AsnTypeTypes.Choice })
export class SigningTime extends Time {}

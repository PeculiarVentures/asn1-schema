import { AsnProp, AsnPropTypes } from "@peculiar/asn1-schema";
import { id_ce, id_pkix, id_kp } from "../object_identifiers";

/**
 * ```
 * id-ce-extKeyUsage OBJECT IDENTIFIER ::= { id-ce 37 }
 * ```
 */
export const id_ce_extKeyUsage = `${id_ce}.37`;

// KeyPurposeId ::= OBJECT IDENTIFIER
export type KeyPurposeId = string;

/**
 * ```
 * ExtKeyUsageSyntax ::= SEQUENCE SIZE (1..MAX) OF KeyPurposeId
 * ```
 */
export class ExtendedKeyUsage {

  @AsnProp({ type: AsnPropTypes.ObjectIdentifier, repeated: true })
  public usages: string[];

  constructor(usages: KeyPurposeId[] = []) {
    this.usages = usages;
  }
}

/**
 * ```
 * anyExtendedKeyUsage OBJECT IDENTIFIER ::= { id-ce-extKeyUsage 0 }
 * ```
 */
export const anyExtendedKeyUsage = `${id_ce_extKeyUsage}.0`;

/**
 * ```
 * id-kp-serverAuth             OBJECT IDENTIFIER ::= { id-kp 1 }
 * -- TLS WWW server authentication
 * -- Key usage bits that may be consistent: digitalSignature,
 * -- keyEncipherment or keyAgreement
 * ```
 */
export const id_kp_serverAuth = `${id_kp}.1`;

/**
 * ```
 * id-kp-clientAuth             OBJECT IDENTIFIER ::= { id-kp 2 }
 * -- TLS WWW client authentication
 * -- Key usage bits that may be consistent: digitalSignature
 * -- and/or keyAgreement
 * ```
 */
export const id_kp_clientAuth = `${id_kp}.2`;

/**
 * ```
 * id-kp-codeSigning             OBJECT IDENTIFIER ::= { id-kp 3 }
 * -- Signing of downloadable executable code
 * -- Key usage bits that may be consistent: digitalSignature
 * ```
 */
export const id_kp_codeSigning = `${id_kp}.3`;

/**
 * ```
 * id-kp-emailProtection         OBJECT IDENTIFIER ::= { id-kp 4 }
 * -- Email protection
 * -- Key usage bits that may be consistent: digitalSignature,
 * -- nonRepudiation, and/or (keyEncipherment or keyAgreement)
 * ```
 */
export const id_kp_emailProtection = `${id_kp}.4`;

/**
 * ```
 * id-kp-timeStamping            OBJECT IDENTIFIER ::= { id-kp 8 }
 * -- Binding the hash of an object to a time
 * -- Key usage bits that may be consistent: digitalSignature
 * -- and/or nonRepudiation
 * ```
 */
export const id_kp_timeStamping = `${id_kp}.8`;

/**
 * ```
 * id-kp-OCSPSigning            OBJECT IDENTIFIER ::= { id-kp 9 }
 * -- Signing OCSP responses
 * -- Key usage bits that may be consistent: digitalSignature
 * -- and/or nonRepudiation
 * ```
 */

export const id_kp_OCSPSigning = `${id_kp}.9`;

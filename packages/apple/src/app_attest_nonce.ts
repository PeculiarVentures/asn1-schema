import { AsnProp, OctetString } from "@peculiar/asn1-schema";

/**
 * Extension OID for App Attest Nonce.
 *
 * ```asn
 * id-appAttestNonce OBJECT IDENTIFIER ::= { 1 2 840 113635 100 8 2 }
 * ```
 */
export const id_appAttestNonce = `1.2.840.113635.100.8.2`;

/**
 * Implements ASN.1 structure for App Attest Nonce.
 * 
 * ```asn1
 * AppAttestNonce ::= SEQUENCE {
 *  nonce [1] EXPLICIT OCTET STRING
 * }
 * ```
 */
export class AppAttestNonce {
  @AsnProp({ type: OctetString, context: 1, implicit: false })
  public nonce!: OctetString;

  public constructor(params: Partial<AppAttestNonce> = {}) {
    Object.assign(this, params);
  }
}
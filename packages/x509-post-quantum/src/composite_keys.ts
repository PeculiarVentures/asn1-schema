import { OneAsymmetricKey } from "@peculiar/asn1-asym-key";
import { AsnArray, AsnType, AsnTypeTypes, BitString, OctetString } from "@peculiar/asn1-schema";
import { AlgorithmIdentifier, SubjectPublicKeyInfo } from "@peculiar/asn1-x509";

/**
 * ```asn
 * -- To be replaced by IANA
 * id-composite-key OBJECT IDENTIFIER ::= {
 *     joint-iso-itu-t(2) country(16) us(840) organization(1) entrust(114027)
 *     Algorithm(80) Composite(4) CompositeKey(1)
 * ```
 */
export const id_composite_key = "2.16.840.1.114027.80.4.1";

/**
 * ```asn
 * id-Dilithium3-ECDSA-P256 OBJECT IDENTIFIER ::= {
 *     joint-iso-itu-t(2) country(16) us(840) organization(1) entrust(114027)
 *     algorithm(80) ExplicitCompositeKey(5) id-Dilithium3-ECDSA-P256(1)
 * ```
 */
export const id_Dilithium3_ECDSA_P256 = "2.16.840.1.114027.80.5.1";

/**
 * ```asn
 * id-Dilithium3-RSA OBJECT IDENTIFIER ::= {
 *     joint-iso-itu-t(2) country(16) us(840) organization(1) entrust(114027)
 *     algorithm(80) ExplicitCompositeKey(5) id-Dilithium3-RSA(2)
 * ```
 */
export const id_Dilithium3_RSA = "2.16.840.1.114027.80.5.2";

@AsnType({ type: AsnTypeTypes.Sequence })
export class CompositeAlgorithmIdentifier extends AlgorithmIdentifier {}

/**
 * ```asn
 * CompositePublicKey ::= SEQUENCE SIZE (2..MAX) OF SubjectPublicKeyInfo
 * ```
 */
@AsnType({ type: AsnTypeTypes.Sequence, itemType: SubjectPublicKeyInfo })
export class CompositePublicKey extends AsnArray<SubjectPublicKeyInfo> {
  constructor(items?: SubjectPublicKeyInfo[]) {
    super(items);

    // Set the prototype explicitly.
    Object.setPrototypeOf(this, CompositePublicKey.prototype);
  }
}

/**
 * ```asn
 * CompositePublicKeyOs ::= OCTET STRING (CONTAINING CompositePublicKey ENCODED BY der)
 * ```
 */
export class CompositePublicKeyOs extends OctetString {}

/**
 * ```asn
 * CompositePublicKeyBs ::= BIT STRING (CONTAINING CompositePublicKey ENCODED BY der)
 * ```
 */
export class CompositePublicKeyBs extends BitString {}

/**
 * ```asn
 * CompositePrivateKey ::= SEQUENCE SIZE (2..MAX) OF OneAsymmetricKey
 * ```
 */
@AsnType({ type: AsnTypeTypes.Sequence, itemType: OneAsymmetricKey })
export class CompositePrivateKey extends AsnArray<OneAsymmetricKey> {
  constructor(items?: OneAsymmetricKey[]) {
    super(items);

    // Set the prototype explicitly.
    Object.setPrototypeOf(this, CompositePrivateKey.prototype);
  }
}

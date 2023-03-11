import { Attributes } from "@peculiar/asn1-pkcs8";
import { AsnArray, AsnProp, AsnPropTypes, AsnType, AsnTypeTypes, BitString, OctetString } from "@peculiar/asn1-schema";
import { AlgorithmIdentifier } from "@peculiar/asn1-x509";

/**
 * ```asn
 *  id-ct-KP-aKeyPackage OBJECT IDENTIFIER ::=
 *    { joint-iso-itu-t(2) country(16) us(840) organization(1)
 *        gov(101) dod(2) infosec(1) formats(2)
 *        key-package-content-types(78) 5
 *    }
 * ```
 */
export const id_ct_KP_aKeyPackage = "2.16.840.1.101.2.1.78.5";

/**
 * ```asn
 * Version ::= INTEGER { v1(0), v2(1) } (v1, ..., v2)
 * ```
 */
export enum Version {
  v1,
  v2,
}

/**
 * ```asn
 *  PrivateKeyAlgorithmIdentifier ::= AlgorithmIdentifier
 *    { PUBLIC-KEY,
 *    { PrivateKeyAlgorithms } }
 * ```
 */
@AsnType({ type: AsnTypeTypes.Sequence })
export class PrivateKeyAlgorithmIdentifier extends AlgorithmIdentifier { }

/**
 * ```asn
 * PrivateKey ::= OCTET STRING
 *   -- Content varies based on type of key. The
 *   -- algorithm identifier dictates the format of
 *   -- the key.
 * ```
 */
export class PrivateKey extends OctetString { }

/**
 * ```asn
 * PublicKey ::= BIT STRING
 *   -- Content varies based on type of key. The
 *   -- algorithm identifier dictates the format of
 *   -- the key.
 * ```
 */
export class PublicKey extends BitString { }

/**
 * ```asn
 * OneAsymmetricKey ::= SEQUENCE {
 *     version                   Version,
 *     privateKeyAlgorithm       PrivateKeyAlgorithmIdentifier,
 *     privateKey                PrivateKey,
 *     attributes            [0] Attributes OPTIONAL,
 *     ...,
 *     [[2: publicKey        [1] PublicKey OPTIONAL ]],
 *     ...
 * }
 * ```
 */
@AsnType({ type: AsnTypeTypes.Sequence })
export class OneAsymmetricKey {

  /**
   * Identifies the version of the OneAsymmetricKey.
   *
   * @remarks
   * If the publicKey is present, then the version is set to v2; otherwise, the version is set to v1.
   */
  @AsnProp({ type: AsnPropTypes.Integer })
  public version = Version.v1;

  /**
   * identifies the private-key algorithm and
   * optionally contains parameters associated with the asymmetric key
   * pair. The algorithm is identified by an object identifier (OID)
   * and the format of the parameters depends on the OID, but the
   * PrivateKeyAlgorithms information object set restricts the
   * permissible OIDs. The value placed in
   * privateKeyAlgorithmIdentifier is the value an originator would
   * apply to indicate which algorithm is to be used with the private
   * key.
   */
  @AsnProp({ type: AlgorithmIdentifier })
  public privateKeyAlgorithm = new AlgorithmIdentifier();

  /**
   * OCTET STRING that contains the value of the
   * private key.  The interpretation of the content is defined in the
   * registration of the private-key algorithm.  For example, a DSA key
   * is an INTEGER, an RSA key is represented as RSAPrivateKey as
   * defined in [RFC3447], and an Elliptic Curve Cryptography (ECC) key
   * is represented as ECPrivateKey as defined in [RFC5915].
   */
  @AsnProp({ type: AsnPropTypes.OctetString })
  public privateKey = new ArrayBuffer(0);

  /**
   * Contains information corresponding to
   * the public key (e.g., certificates).  The attributes field uses the
   * class ATTRIBUTE which is restricted by the
   * OneAsymmetricKeyAttributes information object set.
   * OneAsymmetricKeyAttributes is an open ended set in this document.
   * Others documents can constrain these values.  Attributes from
   * [RFC2985] MAY be supported.
   */
  @AsnProp({ type: Attributes, context: 0, implicit: true, optional: true })
  public attributes?: Attributes;

  // "..." - omitted properties

  /**
   * When present, it contains the public key
   * encoded in a BIT STRING.  The structure within the BIT STRING, if
   * any, depends on the privateKeyAlgorithm.  For example, a DSA key is
   * an INTEGER.  Note that RSA public keys are included in
   * RSAPrivateKey (i.e., n and e are present), as per [RFC3447], and
   * ECC public keys are included in ECPrivateKey (i.e., in the
   * publicKey field), as per [RFC5915].
   */
  @AsnProp({ type: AsnPropTypes.BitString, context: 1, implicit: true, optional: true })
  public publicKey?: ArrayBuffer;

}

/**
 * ```asn
 * PrivateKeyInfo ::= OneAsymmetricKey
 * ```
 */
@AsnType({ type: AsnTypeTypes.Sequence })
export class PrivateKeyInfo extends OneAsymmetricKey { }

/**
 * ```asn
 * AsymmetricKeyPackage ::= SEQUENCE SIZE (1..MAX) OF OneAsymmetricKey
 * ```
 */
@AsnType({ type: AsnTypeTypes.Sequence, itemType: OneAsymmetricKey })
export class AsymmetricKeyPackage extends AsnArray<OneAsymmetricKey>{

  constructor(items?: OneAsymmetricKey[]) {
    super(items);

    // Set the prototype explicitly.
    Object.setPrototypeOf(this, AsymmetricKeyPackage.prototype);
  }

}

export { EncryptedPrivateKeyInfo, EncryptedData } from "@peculiar/asn1-pkcs8";

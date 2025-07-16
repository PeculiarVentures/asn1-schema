import { EnvelopedData } from "@peculiar/asn1-cms";
import { AsnProp, AsnPropTypes, AsnType, AsnTypeTypes } from "@peculiar/asn1-schema";
import { AlgorithmIdentifier, GeneralName, SubjectPublicKeyInfo } from "@peculiar/asn1-x509";

/**
 * ```asn1
 * SubsequentMessage ::= INTEGER {
 *  encrCert (0),
 *  challengeResp (1) }
 * ```
 */
export enum SubsequentMessage {
  encrCert = 0,
  challengeResp = 1,
}

/**
 * ```asn1
 * PKMACValue ::= SEQUENCE {
 *   algId  AlgorithmIdentifier,
 *   value  BIT STRING
 * }
 */
@AsnType({ type: AsnTypeTypes.Sequence })
export class PKMACValue {
  @AsnProp({ type: AlgorithmIdentifier })
  public algId = new AlgorithmIdentifier();

  @AsnProp({ type: AsnPropTypes.BitString })
  public value = new ArrayBuffer(0);

  constructor(params: Partial<PKMACValue> = {}) {
    Object.assign(this, params);
  }
}

/**
 * ```asn1
 * AuthInfo ::= CHOICE {
 *  sender [0] GeneralName, -- used only if an authenticated identity has been
 *                           -- established for the sender (e.g., a DN from a
 *                           -- previously-issued and currently-valid certificate)
 *  publicKeyMAC PKMACValue } -- used if no authenticated GeneralName currently exists for
 *                            -- the sender; publicKeyMAC contains a password-based MAC
 *                            -- on the DER-encoded value of publicKey
 * ```
 */
@AsnType({ type: AsnTypeTypes.Choice })
export class AuthInfo {
  @AsnProp({ type: GeneralName, context: 0, optional: true, implicit: false })
  public sender?: GeneralName;

  @AsnProp({ type: PKMACValue, optional: true })
  public publicKeyMAC?: PKMACValue;

  constructor(params: Partial<AuthInfo> = {}) {
    Object.assign(this, params);
  }
}

/**
 * ```asn1
 * POPOSigningKeyInput ::= SEQUENCE {
 *  authInfo            CHOICE {
 *      sender              [0] GeneralName,
 *      -- used only if an authenticated identity has been
 *      -- established for the sender (e.g., a DN from a
 *      -- previously-issued and currently-valid certificate)
 *      publicKeyMAC        PKMACValue },
 *      -- used if no authenticated GeneralName currently exists for
 *      -- the sender; publicKeyMAC contains a password-based MAC
 *      -- on the DER-encoded value of publicKey
 *  publicKey           SubjectPublicKeyInfo }  -- from CertTemplate
 * ```
 */
@AsnType({ type: AsnTypeTypes.Sequence })
export class POPOSigningKeyInput {
  @AsnProp({ type: AuthInfo })
  public authInfo = new AuthInfo();

  @AsnProp({ type: SubjectPublicKeyInfo })
  public publicKey = new SubjectPublicKeyInfo();

  constructor(params: Partial<POPOSigningKeyInput> = {}) {
    Object.assign(this, params);
  }
}

/**
 * ```asn1
 * POPOSigningKey ::= SEQUENCE {
 *  poposkInput           [0] POPOSigningKeyInput OPTIONAL,
 *  algorithmIdentifier   AlgorithmIdentifier,
 *  signature             BIT STRING }
 * ```
 */
@AsnType({ type: AsnTypeTypes.Sequence })
export class POPOSigningKey {
  @AsnProp({ type: POPOSigningKeyInput, context: 0, optional: true, implicit: true })
  public poposkInput?: POPOSigningKeyInput;

  @AsnProp({ type: AlgorithmIdentifier })
  public algorithmIdentifier = new AlgorithmIdentifier();

  @AsnProp({ type: AsnPropTypes.BitString })
  public signature = new ArrayBuffer(0);

  constructor(params: Partial<POPOSigningKey> = {}) {
    Object.assign(this, params);
  }
}

/**
 * ```asn1
 * POPOPrivKey ::= CHOICE {
 *  thisMessage       [0] BIT STRING,         -- Deprecated
 *  subsequentMessage [1] SubsequentMessage,
 *  dhMAC             [2] BIT STRING,         -- Deprecated
 *  agreeMAC          [3] PKMACValue,
 *  encryptedKey      [4] EnvelopedData }
 * ```
 */
@AsnType({ type: AsnTypeTypes.Choice })
export class POPOPrivKey {
  @AsnProp({ type: AsnPropTypes.BitString, context: 0, optional: true, implicit: true })
  public thisMessage?: ArrayBuffer;

  @AsnProp({ type: AsnPropTypes.Integer, context: 1, optional: true, implicit: true })
  public subsequentMessage?: SubsequentMessage;

  @AsnProp({ type: AsnPropTypes.BitString, context: 2, optional: true, implicit: true })
  public dhMAC?: ArrayBuffer;

  @AsnProp({ type: PKMACValue, context: 3, optional: true, implicit: true })
  public agreeMAC?: PKMACValue;

  @AsnProp({ type: EnvelopedData, context: 4, optional: true, implicit: true })
  public encryptedKey?: EnvelopedData;

  constructor(params: Partial<POPOPrivKey> = {}) {
    Object.assign(this, params);
  }
}

/**
 * ```asn1
 * ProofOfPossession ::= CHOICE {
 *  raVerified        [0] NULL,
 *  -- used if the RA has already verified that the requester is in
 *  -- possession of the private key
 *  signature         [1] POPOSigningKey,
 *  keyEncipherment   [2] POPOPrivKey,
 *  keyAgreement      [3] POPOPrivKey }
 * ```
 */
@AsnType({ type: AsnTypeTypes.Choice })
export class ProofOfPossession {
  @AsnProp({ type: AsnPropTypes.Null, context: 0, optional: true, implicit: true })
  public raVerified?: null;

  @AsnProp({ type: POPOSigningKey, context: 1, optional: true, implicit: true })
  public signature?: POPOSigningKey;

  @AsnProp({ type: POPOPrivKey, context: 2, optional: true, implicit: false })
  public keyEncipherment?: POPOPrivKey;

  @AsnProp({ type: POPOPrivKey, context: 3, optional: true, implicit: false })
  public keyAgreement?: POPOPrivKey;

  constructor(params: Partial<ProofOfPossession> = {}) {
    Object.assign(this, params);
  }
}

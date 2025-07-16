import { EnvelopedData } from "@peculiar/asn1-cms";
import { AsnProp, AsnPropTypes, AsnType, AsnTypeTypes } from "@peculiar/asn1-schema";
import {
  AlgorithmIdentifier,
  Attribute,
  GeneralName,
  SubjectPublicKeyInfo,
} from "@peculiar/asn1-x509";

/**
 * ```asn1
 * RegToken ::= UTF8String
 * ```
 */
export type RegToken = string;

/**
 * ```asn1
 * Authenticator ::= UTF8String
 * ```
 */
export type Authenticator = string;

/**
 * ```asn1
 * KeyGenParameters ::= OCTET STRING
 * ```
 */
export type KeyGenParameters = ArrayBuffer;

/**
 * ```asn1
 * UTF8Pairs ::= UTF8String
 * ```
 */
export type UTF8Pairs = string;

/**
 * ```asn1
 * SinglePubInfo ::= SEQUENCE {
 *  pubMethod    INTEGER {
 *      dontCare    (0),
 *      x500        (1),
 *      web         (2),
 *      ldap        (3) },
 *  pubLocation  GeneralName OPTIONAL }
 * ```
 */
export enum PubMethod {
  dontCare = 0,
  x500 = 1,
  web = 2,
  ldap = 3,
}

@AsnType({ type: AsnTypeTypes.Sequence })
export class SinglePubInfo {
  @AsnProp({ type: AsnPropTypes.Integer })
  public pubMethod: PubMethod = PubMethod.dontCare;

  @AsnProp({ type: GeneralName, optional: true })
  public pubLocation?: GeneralName;

  constructor(params: Partial<SinglePubInfo> = {}) {
    Object.assign(this, params);
  }
}

/**
 * ```asn1
 * PKIPublicationInfo ::= SEQUENCE {
 *  action     INTEGER {
 *              dontPublish (0),
 *              pleasePublish (1) },
 *  pubInfos  SEQUENCE SIZE (1..MAX) OF SinglePubInfo OPTIONAL }
 * ```
 */
export enum PKIPublicationAction {
  dontPublish = 0,
  pleasePublish = 1,
}

@AsnType({ type: AsnTypeTypes.Sequence })
export class PKIPublicationInfo {
  @AsnProp({ type: AsnPropTypes.Integer })
  public action: PKIPublicationAction = PKIPublicationAction.dontPublish;

  @AsnProp({ type: SinglePubInfo, repeated: "sequence", optional: true })
  public pubInfos?: SinglePubInfo[];

  constructor(params: Partial<PKIPublicationInfo> = {}) {
    Object.assign(this, params);
  }
}

/**
 * ```asn1
 * CertId ::= SEQUENCE {
 *  issuer           GeneralName,
 *  serialNumber     INTEGER }
 * ```
 */
@AsnType({ type: AsnTypeTypes.Sequence })
export class CertId {
  @AsnProp({ type: GeneralName })
  public issuer = new GeneralName();

  @AsnProp({ type: AsnPropTypes.Integer })
  public serialNumber = new ArrayBuffer(0);

  constructor(params: Partial<CertId> = {}) {
    Object.assign(this, params);
  }
}

/**
 * ```asn1
 * OldCertId ::= CertId
 * ```
 */
export type OldCertId = CertId;

/**
 * ```asn1
 * ProtocolEncrKey ::= SubjectPublicKeyInfo
 * ```
 */
export type ProtocolEncrKey = SubjectPublicKeyInfo;

/**
 * ```asn1
 * EncryptedValue ::= SEQUENCE {
 *  intendedAlg   [0] AlgorithmIdentifier  OPTIONAL,
 *  symmAlg       [1] AlgorithmIdentifier  OPTIONAL,
 *  encSymmKey    [2] BIT STRING           OPTIONAL,
 *  keyAlg        [3] AlgorithmIdentifier  OPTIONAL,
 *  valueHint     [4] OCTET STRING         OPTIONAL,
 *  encValue       BIT STRING }
 * ```
 */
@AsnType({ type: AsnTypeTypes.Sequence })
export class EncryptedValue {
  @AsnProp({ type: AlgorithmIdentifier, context: 0, optional: true, implicit: true })
  public intendedAlg?: AlgorithmIdentifier;

  @AsnProp({ type: AlgorithmIdentifier, context: 1, optional: true, implicit: true })
  public symmAlg?: AlgorithmIdentifier;

  @AsnProp({ type: AsnPropTypes.BitString, context: 2, optional: true, implicit: true })
  public encSymmKey?: ArrayBuffer;

  @AsnProp({ type: AlgorithmIdentifier, context: 3, optional: true, implicit: true })
  public keyAlg?: AlgorithmIdentifier;

  @AsnProp({ type: AsnPropTypes.OctetString, context: 4, optional: true, implicit: true })
  public valueHint?: ArrayBuffer;

  @AsnProp({ type: AsnPropTypes.BitString })
  public encValue = new ArrayBuffer(0);

  constructor(params: Partial<EncryptedValue> = {}) {
    Object.assign(this, params);
  }
}

/**
 * ```asn1
 * EncryptedKey ::= CHOICE {
 *  encryptedValue        EncryptedValue,   -- Deprecated
 *  envelopedData     [0] EnvelopedData }
 * ```
 */
@AsnType({ type: AsnTypeTypes.Choice })
export class EncryptedKey {
  @AsnProp({ type: EncryptedValue, optional: true })
  public encryptedValue?: EncryptedValue;

  @AsnProp({ type: EnvelopedData, context: 0, optional: true, implicit: true })
  public envelopedData?: EnvelopedData;

  constructor(params: Partial<EncryptedKey> = {}) {
    Object.assign(this, params);
  }
}

/**
 * ```asn1
 * PKIArchiveOptions ::= CHOICE {
 *  encryptedPrivKey     [0] EncryptedKey,
 *  keyGenParameters     [1] KeyGenParameters,
 *  archiveRemGenPrivKey [2] BOOLEAN }
 * ```
 */
@AsnType({ type: AsnTypeTypes.Choice })
export class PKIArchiveOptions {
  @AsnProp({ type: EncryptedKey, context: 0, optional: true, implicit: true })
  public encryptedPrivKey?: EncryptedKey;

  @AsnProp({ type: AsnPropTypes.OctetString, context: 1, optional: true, implicit: true })
  public keyGenParameters?: KeyGenParameters;

  @AsnProp({ type: AsnPropTypes.Boolean, context: 2, optional: true, implicit: true })
  public archiveRemGenPrivKey?: boolean;

  constructor(params: Partial<PKIArchiveOptions> = {}) {
    Object.assign(this, params);
  }
}

/**
 * ```asn1
 * PBMParameter ::= SEQUENCE {
 *    salt                OCTET STRING,
 *    owf                 AlgorithmIdentifier,
 *    iterationCount      INTEGER,
 *    mac                 AlgorithmIdentifier
 * }
 * ```
 */
@AsnType({ type: AsnTypeTypes.Sequence })
export class PBMParameter {
  @AsnProp({ type: AsnPropTypes.OctetString })
  public salt = new ArrayBuffer(0);

  @AsnProp({ type: AlgorithmIdentifier })
  public owf = new AlgorithmIdentifier();

  @AsnProp({ type: AsnPropTypes.Integer })
  public iterationCount = new ArrayBuffer(0);

  @AsnProp({ type: AlgorithmIdentifier })
  public mac = new AlgorithmIdentifier();

  constructor(params: Partial<PBMParameter> = {}) {
    Object.assign(this, params);
  }
}

/**
 * ```asn1
 * PrivateKeyInfo ::= SEQUENCE {
 *    version                   INTEGER,
 *    privateKeyAlgorithm       AlgorithmIdentifier,
 *    privateKey                OCTET STRING,
 *    attributes                [0] IMPLICIT Attributes OPTIONAL
 * }
 * ```
 */
@AsnType({ type: AsnTypeTypes.Sequence })
export class PrivateKeyInfo {
  @AsnProp({ type: AsnPropTypes.Integer })
  public version = new ArrayBuffer(0);

  @AsnProp({ type: AlgorithmIdentifier })
  public privateKeyAlgorithm = new AlgorithmIdentifier();

  @AsnProp({ type: AsnPropTypes.OctetString })
  public privateKey = new ArrayBuffer(0);

  @AsnProp({ type: Attribute, repeated: "set", context: 0, optional: true, implicit: true })
  public attributes?: Attribute[];

  constructor(params: Partial<PrivateKeyInfo> = {}) {
    Object.assign(this, params);
  }
}

/**
 * ```asn1
 * EncKeyWithID ::= SEQUENCE {
 *   privateKey           PrivateKeyInfo,
 *   identifier CHOICE {
 *     string             UTF8String,
 *     generalName        GeneralName
 *   } OPTIONAL
 * }
 * ```
 */
@AsnType({ type: AsnTypeTypes.Choice })
export class EncKeyWithIDIdentifier {
  @AsnProp({ type: AsnPropTypes.Utf8String, optional: true })
  public string?: string;

  @AsnProp({ type: GeneralName, optional: true })
  public generalName?: GeneralName;

  constructor(params: Partial<EncKeyWithIDIdentifier> = {}) {
    Object.assign(this, params);
  }
}

@AsnType({ type: AsnTypeTypes.Sequence })
export class EncKeyWithID {
  @AsnProp({ type: PrivateKeyInfo })
  public privateKey = new PrivateKeyInfo();

  @AsnProp({ type: EncKeyWithIDIdentifier, optional: true })
  public identifier?: EncKeyWithIDIdentifier;

  constructor(params: Partial<EncKeyWithID> = {}) {
    Object.assign(this, params);
  }
}

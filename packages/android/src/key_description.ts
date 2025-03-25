import {
  AsnProp,
  AsnPropTypes,
  AsnArray,
  AsnType,
  AsnTypeTypes,
  OctetString,
} from "@peculiar/asn1-schema";

/**
 * Extension OID for key description.
 *
 * ```asn
 * id-ce-keyDescription OBJECT IDENTIFIER ::= { 1 3 6 1 4 1 11129 2 1 17 }
 * ```
 */
export const id_ce_keyDescription = "1.3.6.1.4.1.11129.2.1.17";

/**
 * Implements ASN.1 enumeration for verified boot state.
 *
 * ```asn
 * VerifiedBootState ::= ENUMERATED {
 *   Verified                   (0),
 *   SelfSigned                 (1),
 *   Unverified                 (2),
 *   Failed                     (3),
 * }
 * ```
 */
export enum VerifiedBootState {
  verified = 0,
  selfSigned = 1,
  unverified = 2,
  failed = 3,
}

/**
 * Implements ASN.1 structure for root of trust.
 *
 * ```asn
 * RootOfTrust ::= SEQUENCE {
 *   verifiedBootKey            OCTET_STRING,
 *   deviceLocked               BOOLEAN,
 *   verifiedBootState          VerifiedBootState,
 *   verifiedBootHash           OCTET_STRING, # KM4
 * }
 * ```
 */
export class RootOfTrust {
  @AsnProp({ type: OctetString })
  public verifiedBootKey: OctetString = new OctetString();

  @AsnProp({ type: AsnPropTypes.Boolean })
  public deviceLocked = false;

  @AsnProp({ type: AsnPropTypes.Enumerated })
  public verifiedBootState: VerifiedBootState = VerifiedBootState.verified;

  /**
   * `verifiedBootHash` must present in `KeyDescription` version 3
   */
  @AsnProp({ type: OctetString, optional: true })
  public verifiedBootHash?: OctetString;

  public constructor(params: Partial<RootOfTrust> = {}) {
    Object.assign(this, params);
  }
}

/**
 * Implements ASN.1 structure for set of integers.
 *
 * ```asn
 * IntegerSet ::= SET OF INTEGER
 * ```
 */
@AsnType({ type: AsnTypeTypes.Set, itemType: AsnPropTypes.Integer })
export class IntegerSet extends AsnArray<number> {
  constructor(items?: number[]) {
    super(items);

    // Set the prototype explicitly.
    Object.setPrototypeOf(this, IntegerSet.prototype);
  }
}

/**
 * Implements ASN.1 structure for authorization list.
 *
 * ```asn
 * AuthorizationList ::= SEQUENCE {
 *   purpose                     [1] EXPLICIT SET OF INTEGER OPTIONAL,
 *   algorithm                   [2] EXPLICIT INTEGER OPTIONAL,
 *   keySize                     [3] EXPLICIT INTEGER OPTIONAL.
 *   digest                      [5] EXPLICIT SET OF INTEGER OPTIONAL,
 *   padding                     [6] EXPLICIT SET OF INTEGER OPTIONAL,
 *   ecCurve                     [10] EXPLICIT INTEGER OPTIONAL,
 *   rsaPublicExponent           [200] EXPLICIT INTEGER OPTIONAL,
 *   mgfDigest                   [203] EXPLICIT SET OF INTEGER OPTIONAL,
 *   rollbackResistance          [303] EXPLICIT NULL OPTIONAL, # KM4
 *   earlyBootOnly               [305] EXPLICIT NULL OPTIONAL, # version 4
 *   activeDateTime              [400] EXPLICIT INTEGER OPTIONAL
 *   originationExpireDateTime   [401] EXPLICIT INTEGER OPTIONAL
 *   usageExpireDateTime         [402] EXPLICIT INTEGER OPTIONAL
 *   usageCountLimit             [405] EXPLICIT INTEGER OPTIONAL,
 *   noAuthRequired              [503] EXPLICIT NULL OPTIONAL,
 *   userAuthType                [504] EXPLICIT INTEGER OPTIONAL,
 *   authTimeout                 [505] EXPLICIT INTEGER OPTIONAL,
 *   allowWhileOnBody            [506] EXPLICIT NULL OPTIONAL,
 *   trustedUserPresenceRequired [507] EXPLICIT NULL OPTIONAL, # KM4
 *   trustedConfirmationRequired [508] EXPLICIT NULL OPTIONAL, # KM4
 *   unlockedDeviceRequired      [509] EXPLICIT NULL OPTIONAL, # KM4
 *   allApplications             [600] EXPLICIT NULL OPTIONAL,
 *   applicationId               [601] EXPLICIT OCTET_STRING OPTIONAL,
 *   creationDateTime            [701] EXPLICIT INTEGER OPTIONAL,
 *   origin                      [702] EXPLICIT INTEGER OPTIONAL,
 *   rollbackResistant           [703] EXPLICIT NULL OPTIONAL, # KM2 and KM3 only.
 *   rootOfTrust                 [704] EXPLICIT RootOfTrust OPTIONAL,
 *   osVersion                   [705] EXPLICIT INTEGER OPTIONAL,
 *   osPatchLevel                [706] EXPLICIT INTEGER OPTIONAL,
 *   attestationApplicationId    [709] EXPLICIT OCTET_STRING OPTIONAL, # KM3
 *   attestationIdBrand          [710] EXPLICIT OCTET_STRING OPTIONAL, # KM3
 *   attestationIdDevice         [711] EXPLICIT OCTET_STRING OPTIONAL, # KM3
 *   attestationIdProduct        [712] EXPLICIT OCTET_STRING OPTIONAL, # KM3
 *   attestationIdSerial         [713] EXPLICIT OCTET_STRING OPTIONAL, # KM3
 *   attestationIdImei           [714] EXPLICIT OCTET_STRING OPTIONAL, # KM3
 *   attestationIdMeid           [715] EXPLICIT OCTET_STRING OPTIONAL, # KM3
 *   attestationIdManufacturer   [716] EXPLICIT OCTET_STRING OPTIONAL, # KM3
 *   attestationIdModel          [717] EXPLICIT OCTET_STRING OPTIONAL, # KM3
 *   vendorPatchLevel            [718] EXPLICIT INTEGER OPTIONAL, # KM4
 *   bootPatchLevel              [719] EXPLICIT INTEGER OPTIONAL, # KM4
 *   deviceUniqueAttestation     [720] EXPLICIT NULL OPTIONAL, # version 4
 *   attestationIdSecondImei     [723] EXPLICIT OCTET_STRING OPTIONAL,
 *   moduleHash                  [724] EXPLICIT OCTET_STRING OPTIONAL,
 * }
 * ```
 */
export class AuthorizationList {
  @AsnProp({ context: 1, type: IntegerSet, optional: true })
  public purpose?: IntegerSet;

  @AsnProp({ context: 2, type: AsnPropTypes.Integer, optional: true })
  public algorithm?: number;

  @AsnProp({ context: 3, type: AsnPropTypes.Integer, optional: true })
  public keySize?: number;

  @AsnProp({ context: 5, type: IntegerSet, optional: true })
  public digest?: IntegerSet;

  @AsnProp({ context: 6, type: IntegerSet, optional: true })
  public padding?: IntegerSet;

  @AsnProp({ context: 10, type: AsnPropTypes.Integer, optional: true })
  public ecCurve?: number;

  @AsnProp({ context: 200, type: AsnPropTypes.Integer, optional: true })
  public rsaPublicExponent?: number;

  @AsnProp({ context: 203, type: IntegerSet, optional: true })
  public mgfDigest?: IntegerSet;

  @AsnProp({ context: 303, type: AsnPropTypes.Null, optional: true })
  public rollbackResistance?: null;

  @AsnProp({ context: 305, type: AsnPropTypes.Null, optional: true })
  public earlyBootOnly?: null;

  @AsnProp({ context: 400, type: AsnPropTypes.Integer, optional: true })
  public activeDateTime?: number;

  @AsnProp({ context: 401, type: AsnPropTypes.Integer, optional: true })
  public originationExpireDateTime?: number;

  @AsnProp({ context: 402, type: AsnPropTypes.Integer, optional: true })
  public usageExpireDateTime?: number;

  @AsnProp({ context: 405, type: AsnPropTypes.Integer, optional: true })
  public usageCountLimit?: number;

  @AsnProp({ context: 503, type: AsnPropTypes.Null, optional: true })
  public noAuthRequired?: null;

  @AsnProp({ context: 504, type: AsnPropTypes.Integer, optional: true })
  public userAuthType?: number;

  @AsnProp({ context: 505, type: AsnPropTypes.Integer, optional: true })
  public authTimeout?: number;

  @AsnProp({ context: 506, type: AsnPropTypes.Null, optional: true })
  public allowWhileOnBody?: null;

  @AsnProp({ context: 507, type: AsnPropTypes.Null, optional: true })
  public trustedUserPresenceRequired?: null;

  @AsnProp({ context: 508, type: AsnPropTypes.Null, optional: true })
  public trustedConfirmationRequired?: null;

  @AsnProp({ context: 509, type: AsnPropTypes.Null, optional: true })
  public unlockedDeviceRequired?: null;

  @AsnProp({ context: 600, type: AsnPropTypes.Null, optional: true })
  public allApplications?: null;

  @AsnProp({ context: 601, type: OctetString, optional: true })
  public applicationId?: OctetString;

  @AsnProp({ context: 701, type: AsnPropTypes.Integer, optional: true })
  public creationDateTime?: number;

  @AsnProp({ context: 702, type: AsnPropTypes.Integer, optional: true })
  public origin?: number;

  @AsnProp({ context: 703, type: AsnPropTypes.Null, optional: true })
  public rollbackResistant?: null;

  @AsnProp({ context: 704, type: RootOfTrust, optional: true })
  public rootOfTrust?: RootOfTrust;

  @AsnProp({ context: 705, type: AsnPropTypes.Integer, optional: true })
  public osVersion?: number;

  @AsnProp({ context: 706, type: AsnPropTypes.Integer, optional: true })
  public osPatchLevel?: number;

  @AsnProp({ context: 709, type: OctetString, optional: true })
  public attestationApplicationId?: OctetString;

  @AsnProp({ context: 710, type: OctetString, optional: true })
  public attestationIdBrand?: OctetString;

  @AsnProp({ context: 711, type: OctetString, optional: true })
  public attestationIdDevice?: OctetString;

  @AsnProp({ context: 712, type: OctetString, optional: true })
  public attestationIdProduct?: OctetString;

  @AsnProp({ context: 713, type: OctetString, optional: true })
  public attestationIdSerial?: OctetString;

  @AsnProp({ context: 714, type: OctetString, optional: true })
  public attestationIdImei?: OctetString;

  @AsnProp({ context: 715, type: OctetString, optional: true })
  public attestationIdMeid?: OctetString;

  @AsnProp({ context: 716, type: OctetString, optional: true })
  public attestationIdManufacturer?: OctetString;

  @AsnProp({ context: 717, type: OctetString, optional: true })
  public attestationIdModel?: OctetString;

  @AsnProp({ context: 718, type: AsnPropTypes.Integer, optional: true })
  public vendorPatchLevel?: number;

  @AsnProp({ context: 719, type: AsnPropTypes.Integer, optional: true })
  public bootPatchLevel?: number;

  @AsnProp({ context: 720, type: AsnPropTypes.Null, optional: true })
  public deviceUniqueAttestation?: null;

  @AsnProp({ context: 723, type: OctetString, optional: true })
  public attestationIdSecondImei?: OctetString;

  @AsnProp({ context: 724, type: OctetString, optional: true })
  public moduleHash?: OctetString;

  public constructor(params: Partial<AuthorizationList> = {}) {
    Object.assign(this, params);
  }
}

/**
 * Implements ASN.1 structure for security level.
 *
 * ```asn
 * SecurityLevel ::= ENUMERATED {
 *   Software                   (0),
 *   TrustedEnvironment         (1),
 *   StrongBox                  (2),
 * }
 * ```
 */
export enum SecurityLevel {
  software = 0,
  trustedEnvironment = 1,
  strongBox = 2,
}

export enum Version {
  KM2 = 1,
  KM3 = 2,
  KM4 = 3,
  KM4_1 = 4,
  keyMint1 = 100,
  keyMint2 = 200,
  keyMint4 = 400, // Added new version 400
}

/**
 * Implements ASN.1 structure for key description.
 *
 * ```asn
 * KeyDescription ::= SEQUENCE {
 *   attestationVersion         INTEGER, # versions 1, 2, 3, 4, 100, and 200
 *   attestationSecurityLevel   SecurityLevel,
 *   keymasterVersion           INTEGER,
 *   keymasterSecurityLevel     SecurityLevel,
 *   attestationChallenge       OCTET_STRING,
 *   uniqueId                   OCTET_STRING,
 *   softwareEnforced           AuthorizationList,
 *   teeEnforced                AuthorizationList,
 * }
 * ```
 */
export class KeyDescription {
  @AsnProp({ type: AsnPropTypes.Integer })
  public attestationVersion: number | Version = Version.KM4;

  @AsnProp({ type: AsnPropTypes.Enumerated })
  public attestationSecurityLevel: SecurityLevel = SecurityLevel.software;

  @AsnProp({ type: AsnPropTypes.Integer })
  public keymasterVersion = 0;

  @AsnProp({ type: AsnPropTypes.Enumerated })
  public keymasterSecurityLevel: SecurityLevel = SecurityLevel.software;

  @AsnProp({ type: OctetString })
  public attestationChallenge = new OctetString();

  @AsnProp({ type: OctetString })
  public uniqueId = new OctetString();

  @AsnProp({ type: AuthorizationList })
  public softwareEnforced = new AuthorizationList();

  @AsnProp({ type: AuthorizationList })
  public teeEnforced = new AuthorizationList();

  public constructor(params: Partial<KeyDescription> = {}) {
    Object.assign(this, params);
  }
}

/**
 * Implements ASN.1 structure for KeyMint key description (v400).
 *
 * ```asn
 * KeyDescription ::= SEQUENCE {
 *   attestationVersion         INTEGER, # version 400
 *   attestationSecurityLevel   SecurityLevel,
 *   keyMintVersion             INTEGER,
 *   keyMintSecurityLevel       SecurityLevel,
 *   attestationChallenge       OCTET_STRING,
 *   uniqueId                   OCTET_STRING,
 *   softwareEnforced           AuthorizationList,
 *   hardwareEnforced           AuthorizationList,
 * }
 * ```
 */
export class KeyMintKeyDescription {
  @AsnProp({ type: AsnPropTypes.Integer })
  public attestationVersion: number | Version = Version.keyMint4;

  @AsnProp({ type: AsnPropTypes.Enumerated })
  public attestationSecurityLevel: SecurityLevel = SecurityLevel.software;

  @AsnProp({ type: AsnPropTypes.Integer })
  public keyMintVersion = 0;

  @AsnProp({ type: AsnPropTypes.Enumerated })
  public keyMintSecurityLevel: SecurityLevel = SecurityLevel.software;

  @AsnProp({ type: OctetString })
  public attestationChallenge = new OctetString();

  @AsnProp({ type: OctetString })
  public uniqueId = new OctetString();

  @AsnProp({ type: AuthorizationList })
  public softwareEnforced = new AuthorizationList();

  @AsnProp({ type: AuthorizationList })
  public hardwareEnforced = new AuthorizationList();

  public constructor(params: Partial<KeyMintKeyDescription> = {}) {
    Object.assign(this, params);
  }

  /**
   * Convert to legacy KeyDescription for backwards compatibility
   */
  public toLegacyKeyDescription(): KeyDescription {
    return new KeyDescription({
      attestationVersion: this.attestationVersion,
      attestationSecurityLevel: this.attestationSecurityLevel,
      keymasterVersion: this.keyMintVersion,
      keymasterSecurityLevel: this.keyMintSecurityLevel,
      attestationChallenge: this.attestationChallenge,
      uniqueId: this.uniqueId,
      softwareEnforced: this.softwareEnforced,
      teeEnforced: this.hardwareEnforced,
    });
  }

  /**
   * Create from legacy KeyDescription for backwards compatibility
   */
  public static fromLegacyKeyDescription(keyDesc: KeyDescription): KeyMintKeyDescription {
    return new KeyMintKeyDescription({
      attestationVersion: keyDesc.attestationVersion,
      attestationSecurityLevel: keyDesc.attestationSecurityLevel,
      keyMintVersion: keyDesc.keymasterVersion,
      keyMintSecurityLevel: keyDesc.keymasterSecurityLevel,
      attestationChallenge: keyDesc.attestationChallenge,
      uniqueId: keyDesc.uniqueId,
      softwareEnforced: keyDesc.softwareEnforced,
      hardwareEnforced: keyDesc.teeEnforced,
    });
  }
}

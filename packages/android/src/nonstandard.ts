import {
  AsnProp,
  AsnPropTypes,
  AsnArray,
  AsnType,
  AsnTypeTypes,
  OctetString,
} from "@peculiar/asn1-schema";
import { AuthorizationList, SecurityLevel, Version } from "./key_description";

/**
 * This file contains classes to handle non-standard key descriptions and authorizations.
 *
 * Due to an issue with the asn1-schema library, referenced at https://github.com/PeculiarVentures/asn1-schema/issues/98#issuecomment-1764345351,
 * the standard key description does not allow for a non-strict order of fields in the `softwareEnforced` and `teeEnforced` attributes.
 *
 * To address this and provide greater flexibility, the `NonStandardKeyDescription` and
 * `NonStandardAuthorizationList` classes were created, allowing for the use of non-standard authorizations and a flexible field order.
 *
 * The purpose of these modifications is to ensure compatibility with specific requirements and standards, as well as to offer
 * more convenient tools for working with key descriptions and authorizations.
 *
 * Please refer to the documentation and class comments before using or modifying them.
 */

/**
 * Represents a non-standard authorization for NonStandardAuthorizationList. It uses the same
 * structure as AuthorizationList, but it is a CHOICE instead of a SEQUENCE, that allows for
 * non-strict ordering of fields.
 */
@AsnType({ type: AsnTypeTypes.Choice })
export class NonStandardAuthorization extends AuthorizationList {}

/**
 * Represents a list of non-standard authorizations.
 * ```asn
 * NonStandardAuthorizationList ::= SEQUENCE OF NonStandardAuthorization
 * ```
 */
@AsnType({ type: AsnTypeTypes.Sequence, itemType: NonStandardAuthorization })
export class NonStandardAuthorizationList extends AsnArray<NonStandardAuthorization> {
  constructor(items?: NonStandardAuthorization[]) {
    super(items);

    // Set the prototype explicitly.
    Object.setPrototypeOf(this, NonStandardAuthorizationList.prototype);
  }

  /**
   * Finds the first authorization that contains the specified key.
   * @param key The key to search for.
   * @returns The first authorization that contains the specified key, or `undefined` if not found.
   */
  findProperty<K extends keyof AuthorizationList>(key: K): AuthorizationList[K] | undefined {
    const prop = this.find((o) => key in o);
    if (prop) {
      return prop[key];
    }
    return undefined;
  }
}

/**
 * The AuthorizationList class allows for non-strict ordering of fields in the
 * softwareEnforced and teeEnforced/hardwareEnforced fields.
 *
 * This behavior is due to an issue with the asn1-schema library, which is
 * documented here: https://github.com/PeculiarVentures/asn1-schema/issues/98#issuecomment-1764345351
 *
 * ```asn
 * KeyDescription ::= SEQUENCE {
 *   attestationVersion         INTEGER, # versions 1, 2, 3, 4, 100, 200, 300, and 400
 *   attestationSecurityLevel   SecurityLevel,
 *   keymasterVersion/keyMintVersion INTEGER,
 *   keymasterSecurityLevel/keyMintSecurityLevel SecurityLevel,
 *   attestationChallenge       OCTET_STRING,
 *   uniqueId                   OCTET_STRING,
 *   softwareEnforced           NonStandardAuthorizationList,
 *   teeEnforced/hardwareEnforced NonStandardAuthorizationList,
 * }
 * ```
 */
export class NonStandardKeyDescription {
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

  @AsnProp({ type: NonStandardAuthorizationList })
  public softwareEnforced = new NonStandardAuthorizationList();

  @AsnProp({ type: NonStandardAuthorizationList })
  public teeEnforced = new NonStandardAuthorizationList();

  // KeyMint v400 compatibility properties - not directly decoded from ASN.1
  // but accessed via getters/setters to maintain backwards compatibility
  public get keyMintVersion(): number {
    return this.keymasterVersion;
  }

  public set keyMintVersion(value: number) {
    this.keymasterVersion = value;
  }

  public get keyMintSecurityLevel(): SecurityLevel {
    return this.keymasterSecurityLevel;
  }

  public set keyMintSecurityLevel(value: SecurityLevel) {
    this.keymasterSecurityLevel = value;
  }

  public get hardwareEnforced(): NonStandardAuthorizationList {
    return this.teeEnforced;
  }

  public set hardwareEnforced(value: NonStandardAuthorizationList) {
    this.teeEnforced = value;
  }

  public constructor(params: Partial<NonStandardKeyDescription> = {}) {
    Object.assign(this, params);
  }
}

/**
 * New class for v300 and v400 KeyMint non-standard key description.
 * This uses the same underlying structure as NonStandardKeyDescription,
 * but with renamed properties to match the updated specification.
 */
@AsnType({ type: AsnTypeTypes.Sequence })
export class NonStandardKeyMintKeyDescription extends NonStandardKeyDescription {
  // Override constructor to use the correct property names
  public constructor(params: Partial<NonStandardKeyDescription> = {}) {
    // Translate between old and new property names if needed
    if ("keymasterVersion" in params && !("keyMintVersion" in params)) {
      params.keyMintVersion = params.keymasterVersion;
    }
    if ("keymasterSecurityLevel" in params && !("keyMintSecurityLevel" in params)) {
      params.keyMintSecurityLevel = params.keymasterSecurityLevel;
    }
    if ("teeEnforced" in params && !("hardwareEnforced" in params)) {
      params.hardwareEnforced = params.teeEnforced;
    }

    super(params);
  }
}

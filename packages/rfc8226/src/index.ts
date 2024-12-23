import * as asn from "@peculiar/asn1-schema";

// ASN.1 Module: https://datatracker.ietf.org/doc/html/rfc8226#appendix-A

// TN-Module-2016
//   { iso(1) identified-organization(3) dod(6) internet(1) security(5)
//     mechanisms(5) pkix(7) id-mod(0) id-mod-tn-module(89) }

// DEFINITIONS EXPLICIT TAGS ::= BEGIN

const id_pkix = "1.3.6.1.5.5.7";

export const id_pe = `${id_pkix}.1`;
export const id_ad = `${id_pkix}.48`;

/**
 * ```asn
 * JWTClaimName ::= IA5String
 * ```
 */
export type JWTClaimName = string;

// --
// -- JWT Claim Constraints Certificate Extension
// --

// ext-jwtClaimConstraints EXTENSION  ::= {
//   SYNTAX JWTClaimConstraints IDENTIFIED BY id-pe-JWTClaimConstraints
//   }

/**
 * ```asn
 * id-pe-JWTClaimConstraints OBJECT IDENTIFIER ::= { id-pe 27 }
 * ```
 */
export const id_pe_JWTClaimConstraints = `${id_pe}.27`;

/**
 * ```asn
 * JWTClaimNames ::= SEQUENCE SIZE (1..MAX) OF JWTClaimName
 * ```
 */
@asn.AsnType({
  type: asn.AsnTypeTypes.Sequence,
  itemType: asn.AsnPropTypes.IA5String,
})
export class JWTClaimNames extends asn.AsnArray<JWTClaimName> {
  constructor(items?: JWTClaimName[]) {
    super(items);

    // Set the prototype explicitly.
    Object.setPrototypeOf(this, JWTClaimNames.prototype);
  }
}

/**
 * ```asn
 * JWTClaimPermittedValues ::= SEQUENCE {
 *   claim  JWTClaimName,
 *   permitted  SEQUENCE SIZE (1..MAX) OF UTF8String }
 * ```
 */
export class JWTClaimPermittedValues {
  @asn.AsnProp({
    type: asn.AsnPropTypes.IA5String,
  })
  public claim = "";

  @asn.AsnProp({
    type: asn.AsnPropTypes.Utf8String,
    repeated: "sequence",
  })
  public permitted = [];

  constructor(params: Partial<JWTClaimPermittedValues> = {}) {
    Object.assign(this, params);
  }
}

/**
 * ```asn
 * JWTClaimPermittedValuesList ::= SEQUENCE SIZE (1..MAX) Of
 *                                   JWTClaimPermittedValues
 * ```
 */
@asn.AsnType({
  type: asn.AsnTypeTypes.Sequence,
  itemType: JWTClaimPermittedValues,
})
export class JWTClaimPermittedValuesList extends asn.AsnArray<JWTClaimPermittedValues> {
  constructor(items?: JWTClaimPermittedValues[]) {
    super(items);

    // Set the prototype explicitly.
    Object.setPrototypeOf(this, JWTClaimPermittedValuesList.prototype);
  }
}

/**
 * JWTClaimConstraints ::= SEQUENCE {
 *   mustInclude [0] JWTClaimNames OPTIONAL,
 *     -- The listed claim names MUST appear in the PASSporT
 *     -- in addition to iat, orig, and dest.  If absent, iat, orig,
 *     -- and dest MUST appear in the PASSporT.
 *   permittedValues [1] JWTClaimPermittedValuesList OPTIONAL }
 *     -- If the claim name is present, the claim MUST contain one of
 *     -- the listed values.
 * ( WITH COMPONENTS { ..., mustInclude PRESENT } |
 *   WITH COMPONENTS { ..., permittedValues PRESENT } )
 */
export class JWTClaimConstraints {
  @asn.AsnProp({
    type: JWTClaimNames,
    optional: true,
    context: 0,
  })
  public mustInclude?: JWTClaimNames;

  @asn.AsnProp({
    type: JWTClaimPermittedValuesList,
    optional: true,
    context: 1,
  })
  public permittedValues?: JWTClaimPermittedValuesList;

  constructor(params: Partial<JWTClaimConstraints> = {}) {
    Object.assign(this, params);
  }
}

// --
// -- Telephony Number Authorization List Certificate Extension
// --

// ext-tnAuthList  EXTENSION  ::= {
//   SYNTAX TNAuthorizationList IDENTIFIED BY id-pe-TNAuthList
//   }

/**
 * ```asn
 * id-pe-TNAuthList OBJECT IDENTIFIER ::= { id-pe 26 }
 * ```
 */
export const id_pe_TNAuthList = `${id_pe}.26`;

/**
 * ```asn
 * TelephoneNumber ::= IA5String (SIZE (1..15)) (FROM ("0123456789#*"))
 * ```
 */
export type TelephoneNumber = string;

/**
 * ```asn
 * TelephoneNumberRange ::= SEQUENCE {
 *   start TelephoneNumber,
 *   count INTEGER (2..MAX),
 *   ...
 *   }
 * ```
 */
export class TelephoneNumberRange {
  @asn.AsnProp({ type: asn.AsnPropTypes.IA5String })
  public start: TelephoneNumber = "";

  @asn.AsnProp({ type: asn.AsnPropTypes.Integer })
  public count = 2;
}

/**
 * ```asn
 * ServiceProviderCode ::= IA5String
 * ```
 */
export type ServiceProviderCode = string;

/**
 * ```asn
 * TNEntry ::= CHOICE {
 *   spc    [0] ServiceProviderCode,
 *   range  [1] TelephoneNumberRange,
 *   one    [2] TelephoneNumber
 *   }
 * ```
 */
@asn.AsnType({
  type: asn.AsnTypeTypes.Choice,
})
export class TNEntry {
  @asn.AsnProp({
    type: asn.AsnPropTypes.IA5String,
    context: 0,
  })
  public spc?: ServiceProviderCode;

  @asn.AsnProp({
    type: TelephoneNumberRange,
    context: 1,
  })
  public range?: TelephoneNumberRange;

  @asn.AsnProp({
    type: asn.AsnPropTypes.IA5String,
    context: 2,
  })
  public one?: string;

  constructor(params: Partial<TNEntry> = {}) {
    Object.assign(this, params);
  }
}

/**
 * ```asn
 * TNAuthorizationList ::= SEQUENCE SIZE (1..MAX) OF TNEntry
 * ```
 */
@asn.AsnType({
  type: asn.AsnTypeTypes.Sequence,
  itemType: TNEntry,
})
export class TNAuthorizationList extends asn.AsnArray<TNEntry> {
  constructor(items?: TNEntry[]) {
    super(items);

    // Set the prototype explicitly.
    Object.setPrototypeOf(this, TNAuthorizationList.prototype);
  }
}

// -- SPCs may be OCNs, various SPIDs, or other SP identifiers
// -- from the telephone network.

// -- TN Access Descriptor

/**
 * ```asn
 * id-ad-stirTNList OBJECT IDENTIFIER ::= { id-ad 14 }
 * ```
 */
export const id_ad_stirTNList = `${id_ad}.14`;

// END

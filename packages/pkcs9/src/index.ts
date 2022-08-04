import { AsnType, AsnTypeTypes, AsnPropTypes, AsnProp, OctetString, AsnArray } from "@peculiar/asn1-schema";
import * as cms from "@peculiar/asn1-cms";
import * as pfx from "@peculiar/asn1-pfx";
import * as pkcs8 from "@peculiar/asn1-pkcs8";
import * as x509 from "@peculiar/asn1-x509";
import * as attr from "@peculiar/asn1-x509-attr";

/**
 * ASN.1 module
 *
 * This appendix includes all of the ASN.1 type and value definitions
 * contained in this document in the form of the ASN.1 module PKCS-9.
 *
 * PKCS-9 {iso(1) member-body(2) us(840) rsadsi(113549) pkcs(1)
 * pkcs-9(9) modules(0) pkcs-9(1)}
 * DEFINITIONS IMPLICIT TAGS ::=
 *
 * BEGIN
 *
 * -- EXPORTS All --
 * -- All types and values defined in this module is exported for use
 * -- in other ASN.1 modules.
 *
 * IMPORTS
 *
 * informationFramework, authenticationFramework,
 * selectedAttributeTypes, upperBounds , id-at
 *         FROM UsefulDefinitions {joint-iso-itu-t ds(5) module(1)
 *         usefulDefinitions(0) 3}
 *
 * ub-name
 *         FROM UpperBounds upperBounds
 *
 * OBJECT-CLASS, ATTRIBUTE, MATCHING-RULE, Attribute, top,
 * objectIdentifierMatch
 *         FROM InformationFramework informationFramework
 *
 * ALGORITHM, Extensions, Time
 *         FROM AuthenticationFramework authenticationFramework
 *
 * DirectoryString, octetStringMatch, caseIgnoreMatch, caseExactMatch,
 * generalizedTimeMatch, integerMatch, serialNumber
 *         FROM SelectedAttributeTypes selectedAttributeTypes
 *
 * ContentInfo, SignerInfo
 *         FROM CryptographicMessageSyntax {iso(1) member-body(2) us(840)
 *         rsadsi(113549) pkcs(1) pkcs-9(9) smime(16) modules(0) cms(1)}
 *
 * EncryptedPrivateKeyInfo
 *         FROM PKCS-8 {iso(1) member-body(2) us(840) rsadsi(113549)
 *         pkcs(1) pkcs-8(8) modules(1) pkcs-8(1)}
 *
 * PFX
 *         FROM PKCS-12 {iso(1) member-body(2) us(840) rsadsi(113549)
 *         pkcs(1) pkcs-12(12) modules(0) pkcs-12(1)}
 *
 * PKCS15Token
 *         FROM PKCS-15 {iso(1) member-body(2) us(840) rsadsi(113549)
 *         pkcs(1) pkcs-15(15) modules(1) pkcs-15(1)};
 *
 * -- Upper bounds
 *
 * pkcs-9-ub-pkcs9String         INTEGER ::= 255
 * pkcs-9-ub-emailAddress        INTEGER ::= pkcs-9-ub-pkcs9String
 * pkcs-9-ub-unstructuredName    INTEGER ::= pkcs-9-ub-pkcs9String
 * pkcs-9-ub-unstructuredAddress INTEGER ::= pkcs-9-ub-pkcs9String
 * pkcs-9-ub-challengePassword   INTEGER ::= pkcs-9-ub-pkcs9String
 * pkcs-9-ub-friendlyName        INTEGER ::= pkcs-9-ub-pkcs9String
 * pkcs-9-ub-signingDescription  INTEGER ::= pkcs-9-ub-pkcs9String
 * pkcs-9-ub-match               INTEGER ::= pkcs-9-ub-pkcs9String
 * pkcs-9-ub-pseudonym           INTEGER ::= ub-name
 * pkcs-9-ub-placeOfBirth        INTEGER ::= ub-name
 *
 * -- Object Identifiers
 */

/**
 * pkcs-9 OBJECT IDENTIFIER ::= {iso(1) member-body(2) us(840)
 *                               rsadsi(113549) pkcs(1) 9}
 */
export const id_pkcs9 = "1.2.840.113549.1.9";

//#region Main arcs

/**
 * pkcs-9-mo OBJECT IDENTIFIER ::= {pkcs-9 0}  -- Modules branch
 */
export const id_pkcs9_mo = `${id_pkcs9}.0`;

/**
 * pkcs-9-oc OBJECT IDENTIFIER ::= {pkcs-9 24} -- Object class branch
 */
export const id_pkcs9_oc = `${id_pkcs9}.24`;

/**
 * pkcs-9-at OBJECT IDENTIFIER ::= {pkcs-9 25} -- Attribute branch, for
 *                                             -- new  attributes
 */
export const id_pkcs9_at = `${id_pkcs9}.25`;

/**
 * pkcs-9-sx OBJECT IDENTIFIER ::= {pkcs-9 26} -- For syntaxes (RFC 2252)
 */
export const id_pkcs9_sx = `${id_pkcs9}.26`;

/**
 * pkcs-9-mr OBJECT IDENTIFIER ::= {pkcs-9 27} -- Matching rules
 */
export const id_pkcs9_mr = `${id_pkcs9}.27`;

//#endregion

//#region Object classes

/**
 * pkcs-9-oc-pkcsEntity    OBJECT IDENTIFIER ::= {pkcs-9-oc 1}
 */
export const id_pkcs9_oc_pkcsEntity = `${id_pkcs9_oc}.1`;

/**
 * pkcs-9-oc-naturalPerson OBJECT IDENTIFIER ::= {pkcs-9-oc 2}
 */
export const id_pkcs9_oc_naturalPerson = `${id_pkcs9_oc}.2`;

//#endregion

//#region Attributes

/**
 * pkcs-9-at-emailAddress        OBJECT IDENTIFIER ::= {pkcs-9 1}
 */
export const id_pkcs9_at_emailAddress = `${id_pkcs9}.1`;

/**
 * pkcs-9-at-unstructuredName    OBJECT IDENTIFIER ::= {pkcs-9 2}
 */
export const id_pkcs9_at_unstructuredName = `${id_pkcs9}.2`;

/**
 * pkcs-9-at-contentType         OBJECT IDENTIFIER ::= {pkcs-9 3}
 */
export const id_pkcs9_at_contentType = `${id_pkcs9}.3`;

/**
 * pkcs-9-at-messageDigest       OBJECT IDENTIFIER ::= {pkcs-9 4}
 */
export const id_pkcs9_at_messageDigest = `${id_pkcs9}.4`;

/**
 * pkcs-9-at-signingTime         OBJECT IDENTIFIER ::= {pkcs-9 5}
 */
export const id_pkcs9_at_signingTime = `${id_pkcs9}.5`;

/**
 * pkcs-9-at-counterSignature    OBJECT IDENTIFIER ::= {pkcs-9 6}
 */
export const id_pkcs9_at_counterSignature = `${id_pkcs9}.6`;

/**
 * pkcs-9-at-challengePassword   OBJECT IDENTIFIER ::= {pkcs-9 7}
 */
export const id_pkcs9_at_challengePassword = `${id_pkcs9}.7`;

/**
 * pkcs-9-at-unstructuredAddress OBJECT IDENTIFIER ::= {pkcs-9 8}
 */
export const id_pkcs9_at_unstructuredAddress = `${id_pkcs9}.8`;

/**
 * pkcs-9-at-extendedCertificateAttributes
 *                               OBJECT IDENTIFIER ::= {pkcs-9 9}
 */
export const id_pkcs9_at_extendedCertificateAttributes = `${id_pkcs9}.9`;

/**
 * -- Obsolete (?) attribute identifiers, purportedly from "tentative
 * -- PKCS #9 draft"
 * -- pkcs-9-at-issuerAndSerialNumber OBJECT IDENTIFIER ::= {pkcs-9 10}
 * -- pkcs-9-at-passwordCheck         OBJECT IDENTIFIER ::= {pkcs-9 11}
 * -- pkcs-9-at-publicKey             OBJECT IDENTIFIER ::= {pkcs-9 12}
 */

/**
 * pkcs-9-at-signingDescription       OBJECT IDENTIFIER ::= {pkcs-9 13}
 */
export const id_pkcs9_at_signingDescription = `${id_pkcs9}.13`;

/**
 * pkcs-9-at-extensionRequest         OBJECT IDENTIFIER ::= {pkcs-9 14}
 */
export const id_pkcs9_at_extensionRequest = `${id_pkcs9}.14`;

/**
 * pkcs-9-at-smimeCapabilities        OBJECT IDENTIFIER ::= {pkcs-9 15}
 */
export const id_pkcs9_at_smimeCapabilities = `${id_pkcs9}.15`;

/**
 * -- Unused (?)
 * -- pkcs-9-at-?                     OBJECT IDENTIFIER ::= {pkcs-9 17}
 * -- pkcs-9-at-?                     OBJECT IDENTIFIER ::= {pkcs-9 18}
 * -- pkcs-9-at-?                     OBJECT IDENTIFIER ::= {pkcs-9 19}
 */

/**
 * pkcs-9-at-friendlyName             OBJECT IDENTIFIER ::= {pkcs-9 20}
 */
export const id_pkcs9_at_friendlyName = `${id_pkcs9}.20`;

/**
 * pkcs-9-at-localKeyId               OBJECT IDENTIFIER ::= {pkcs-9 21}
 */
export const id_pkcs9_at_localKeyId = `${id_pkcs9}.21`;

/**
 * pkcs-9-at-userPKCS12               OBJECT IDENTIFIER ::=
 *                                       {2 16 840 1 113730 3 1 216}
 */
export const id_pkcs9_at_userPKCS12 = `2.16.840.1.113730.3.1.216`;

/**
 * pkcs-9-at-pkcs15Token              OBJECT IDENTIFIER ::= {pkcs-9-at 1}
 */
export const id_pkcs9_at_pkcs15Token = `${id_pkcs9_at}.1`;

/**
 * pkcs-9-at-encryptedPrivateKeyInfo  OBJECT IDENTIFIER ::= {pkcs-9-at 2}
 */
export const id_pkcs9_at_encryptedPrivateKeyInfo = `${id_pkcs9_at}.2`;

/**
 * pkcs-9-at-randomNonce              OBJECT IDENTIFIER ::= {pkcs-9-at 3}
 */
export const id_pkcs9_at_randomNonce = `${id_pkcs9_at}.3`;

/**
 * pkcs-9-at-sequenceNumber           OBJECT IDENTIFIER ::= {pkcs-9-at 4}
 */
export const id_pkcs9_at_sequenceNumber = `${id_pkcs9_at}.4`;

/**
 * pkcs-9-at-pkcs7PDU                 OBJECT IDENTIFIER ::= {pkcs-9-at 5}
 */
export const id_pkcs9_at_pkcs7PDU = `${id_pkcs9_at}.5`;

//#region IETF PKIX Attribute branch

/**
 * ietf-at                            OBJECT IDENTIFIER ::=
 *                                       {1 3 6 1 5 5 7 9}
 */
export const id_ietf_at = `1.3.6.1.5.5.7.9`;

/**
 * pkcs-9-at-dateOfBirth              OBJECT IDENTIFIER ::= {ietf-at 1}
 */
export const id_pkcs9_at_dateOfBirth = `${id_ietf_at}.1`;

/**
 * pkcs-9-at-placeOfBirth             OBJECT IDENTIFIER ::= {ietf-at 2}
 */
export const id_pkcs9_at_placeOfBirth = `${id_ietf_at}.2`;

/**
 * pkcs-9-at-gender                   OBJECT IDENTIFIER ::= {ietf-at 3}
 */
export const id_pkcs9_at_gender = `${id_ietf_at}.3`;

/**
 * pkcs-9-at-countryOfCitizenship     OBJECT IDENTIFIER ::= {ietf-at 4}
 */
export const id_pkcs9_at_countryOfCitizenship = `${id_ietf_at}.4`;

/**
 * pkcs-9-at-countryOfResidence       OBJECT IDENTIFIER ::= {ietf-at 5}
 */
export const id_pkcs9_at_countryOfResidence = `${id_ietf_at}.5`;

//#endregion

//#endregion

//#region Syntaxes (for use with LDAP accessible directories)

/**
 * pkcs-9-sx-pkcs9String              OBJECT IDENTIFIER ::= {pkcs-9-sx 1}
 */
export const id_pkcs9_sx_pkcs9String = `${id_pkcs9_sx}.1`;

/**
 * pkcs-9-sx-signingTime              OBJECT IDENTIFIER ::= {pkcs-9-sx 2}
 */
export const id_pkcs9_sx_signingTime = `${id_pkcs9_sx}.2`;

//#endregion

//#region Matching rules

/**
 * pkcs-9-mr-caseIgnoreMatch          OBJECT IDENTIFIER ::= {pkcs-9-mr 1}
 */
export const id_pkcs9_mr_caseIgnoreMatch = `${id_pkcs9_mr}.1`;

/**
 * pkcs-9-mr-signingTimeMatch         OBJECT IDENTIFIER ::= {pkcs-9-mr 2}
 */
export const id_pkcs9_mr_signingTimeMatch = `${id_pkcs9_mr}.2`;

//#endregion
/**
 *   -- Arcs with attributes defined elsewhere
 */
/**
 * smime                              OBJECT IDENTIFIER ::= {pkcs-9 16}
 */
export const id_smime = `${id_pkcs9}.16`;
/**
 *   -- Main arc for S/MIME (RFC 2633)
 */
/**
 * certTypes                          OBJECT IDENTIFIER ::= {pkcs-9 22}
 */
export const id_certTypes = `${id_pkcs9}.22`;

/**
 *   -- Main arc for certificate types defined in PKCS #12
 * crlTypes                           OBJECT IDENTIFIER ::= {pkcs-9 23}
 */
export const crlTypes = `${id_pkcs9}.23`;

/**
 *   -- Main arc for crl types defined in PKCS #12
 *
 *   -- Other object identifiers
 */
/**
 * id-at-pseudonym                    OBJECT IDENTIFIER ::= {id-at 65}
 */
export const id_at_pseudonym = `${attr.id_at}.65`;

/**
 * -- Useful types
 */

/**
 * PKCS9String {INTEGER : maxSize} ::= CHOICE {
 *         ia5String IA5String (SIZE(1..maxSize)),
 *         directoryString DirectoryString {maxSize}
 * }
 */
@AsnType({ type: AsnTypeTypes.Choice })
export class PKCS9String extends x509.DirectoryString {

  @AsnProp({ type: AsnPropTypes.IA5String })
  public ia5String?: string;

  constructor(params: Partial<PKCS9String> = {}) {
    super(params);
  }

  public toString(): string {
    const o = {};
    o.toString();
    return this.ia5String || super.toString();
  }

}

/**
 *
 * -- Object classes
 */
/**
 * pkcsEntity OBJECT-CLASS ::= {
 *         SUBCLASS OF     { top }
 *         KIND            auxiliary
 *         MAY CONTAIN     { PKCSEntityAttributeSet }
 *         ID              pkcs-9-oc-pkcsEntity
 * }
 *
 * naturalPerson OBJECT-CLASS ::= {
 *         SUBCLASS OF     { top }
 *         KIND            auxiliary
 *         MAY CONTAIN     { NaturalPersonAttributeSet }
 *         ID              pkcs-9-oc-naturalPerson
 * }
 *
 * -- Attribute sets
 *
 * PKCSEntityAttributeSet ATTRIBUTE ::= {
 *         pKCS7PDU |
 *         userPKCS12 |
 *         pKCS15Token |
 *         encryptedPrivateKeyInfo,
 *         ... -- For future extensions
 * }
 *
 * NaturalPersonAttributeSet ATTRIBUTE ::= {
 *         emailAddress |
 *         unstructuredName |
 *         unstructuredAddress |
 *         dateOfBirth |
 *         placeOfBirth |
 *         gender |
 *         countryOfCitizenship |
 *         countryOfResidence |
 *         pseudonym |
 *         serialNumber,
 *         ... -- For future extensions
 * }
 *
 * -- Attributes
 */
/**
 * pKCS7PDU ATTRIBUTE ::= {
 *         WITH SYNTAX ContentInfo
 *         ID pkcs-9-at-pkcs7PDU
 * }
 */
@AsnType({ type: AsnTypeTypes.Sequence })
export class Pkcs7PDU extends cms.ContentInfo { }
/**
 * userPKCS12 ATTRIBUTE ::= {
 *         WITH SYNTAX PFX
 *         ID pkcs-9-at-userPKCS12
 * }
 */
@AsnType({ type: AsnTypeTypes.Sequence })
export class UserPKCS12 extends pfx.PFX { }

/**
 * pKCS15Token ATTRIBUTE ::= {
 *         WITH SYNTAX PKCS15Token
 *         ID pkcs-9-at-pkcs15Token
 * }
 */
// TODO: Implement PKCS15
// @AsnType({type: AsnTypeTypes.Sequence})
// export class Pkcs15Token extends PKCS15Token { }

/**
 * encryptedPrivateKeyInfo ATTRIBUTE ::= {
 *         WITH SYNTAX EncryptedPrivateKeyInfo
 *         ID pkcs-9-at-encryptedPrivateKeyInfo
 * }
 */
@AsnType({ type: AsnTypeTypes.Sequence })
export class EncryptedPrivateKeyInfo extends pkcs8.EncryptedPrivateKeyInfo { }

/**
 * emailAddress ATTRIBUTE ::= {
 *         WITH SYNTAX IA5String (SIZE(1..pkcs-9-ub-emailAddress))
 *         EQUALITY MATCHING RULE pkcs9CaseIgnoreMatch
 *         ID pkcs-9-at-emailAddress
 * }
 */
@AsnType({ type: AsnTypeTypes.Choice })
export class EmailAddress {

  @AsnProp({ type: AsnPropTypes.IA5String })
  public value: string;

  public constructor(value = "") {
    this.value = value;
  }

  /**
   * Returns a string representation of an object.
   */
  public toString(): string {
    return this.value;
  }
}

/**
 * unstructuredName ATTRIBUTE ::= {
 *         WITH SYNTAX PKCS9String {pkcs-9-ub-unstructuredName}
 *         EQUALITY MATCHING RULE pkcs9CaseIgnoreMatch
 *         ID pkcs-9-at-unstructuredName
 * }
 */
@AsnType({ type: AsnTypeTypes.Choice })
export class UnstructuredName extends PKCS9String { }

/**
 * unstructuredAddress ATTRIBUTE ::= {
 *         WITH SYNTAX DirectoryString {pkcs-9-ub-unstructuredAddress}
 *         EQUALITY MATCHING RULE caseIgnoreMatch
 *         ID pkcs-9-at-unstructuredAddress
 * }
 */
@AsnType({ type: AsnTypeTypes.Choice })
export class UnstructuredAddress extends x509.DirectoryString { }

/**
 * dateOfBirth ATTRIBUTE ::= {
 *         WITH SYNTAX GeneralizedTime
 *         EQUALITY MATCHING RULE generalizedTimeMatch
 *         SINGLE VALUE TRUE
 *         ID pkcs-9-at-dateOfBirth
 * }
 */
@AsnType({ type: AsnTypeTypes.Choice })
export class DateOfBirth {

  @AsnProp({ type: AsnPropTypes.GeneralizedTime })
  public value: Date;

  public constructor(value = new Date()) {
    this.value = value;
  }

}

/**
 * placeOfBirth ATTRIBUTE ::= {
 *         WITH SYNTAX DirectoryString {pkcs-9-ub-placeOfBirth}
 *         EQUALITY MATCHING RULE caseExactMatch
 *         SINGLE VALUE TRUE
 *         ID pkcs-9-at-placeOfBirth
 * }
 */
@AsnType({ type: AsnTypeTypes.Choice })
export class PlaceOfBirth extends x509.DirectoryString { }

export type GenderType = "M" | "F" | "m" | "f";

/**
 * gender ATTRIBUTE ::= {
 *         WITH SYNTAX PrintableString (SIZE(1) ^
 *                     FROM ("M" | "F" | "m" | "f"))
 *         EQUALITY MATCHING RULE caseIgnoreMatch
 *         SINGLE VALUE TRUE
 *         ID pkcs-9-at-gender
 * }
 */
@AsnType({ type: AsnTypeTypes.Choice })
export class Gender {

  @AsnProp({ type: AsnPropTypes.PrintableString })
  public value: GenderType;

  /**
   * Initialize Gender object
   * @param value Gender object value. Default value is 'M'.
   */
  public constructor(value: GenderType = "M") {
    this.value = value;
  }

  /**
   * Returns a string representation of an object.
   */
  public toString(): string {
    return this.value;
  }

}

/**
 * countryOfCitizenship ATTRIBUTE ::= {
 *         WITH SYNTAX PrintableString (SIZE(2))(CONSTRAINED BY {
 *         -- Must be a two-letter country acronym in accordance with
 *         -- ISO/IEC 3166 --})
 *         EQUALITY MATCHING RULE caseIgnoreMatch
 *         ID pkcs-9-at-countryOfCitizenship
 * }
 */
@AsnType({ type: AsnTypeTypes.Choice })
export class CountryOfCitizenship {

  /**
   * Country name. Must be a two-letter country acronym in accordance with ISO/IEC 3166
   */
  @AsnProp({ type: AsnPropTypes.PrintableString })
  public value: string;

  public constructor(value = "") {
    this.value = value;
  }

  /**
   * Returns a string representation of an object.
   */
  public toString(): string {
    return this.value;
  }

}

/**
 * countryOfResidence ATTRIBUTE ::= {
 *         WITH SYNTAX PrintableString (SIZE(2))(CONSTRAINED BY {
 *         -- Must be a two-letter country acronym in accordance with
 *         -- ISO/IEC 3166 --})
 *         EQUALITY MATCHING RULE caseIgnoreMatch
 *         ID pkcs-9-at-countryOfResidence
 * }
 */
@AsnType({ type: AsnTypeTypes.Choice })
export class CountryOfResidence extends CountryOfCitizenship { }

/**
 * pseudonym ATTRIBUTE ::= {
 *         WITH SYNTAX DirectoryString {pkcs-9-ub-pseudonym}
 *         EQUALITY MATCHING RULE caseExactMatch
 *         ID id-at-pseudonym
 * }
 */
@AsnType({ type: AsnTypeTypes.Choice })
export class Pseudonym extends x509.DirectoryString { }

/**
 * contentType ATTRIBUTE ::= {
 *         WITH SYNTAX ContentType
 *         EQUALITY MATCHING RULE objectIdentifierMatch
 *         SINGLE VALUE TRUE
 *         ID pkcs-9-at-contentType
 * }
 */
@AsnType({ type: AsnTypeTypes.Choice })
export class ContentType {

  @AsnProp({ type: AsnPropTypes.ObjectIdentifier })
  public value: string;

  public constructor(value = "") {
    this.value = value;
  }

  /**
   * Returns a string representation of an object.
   */
  public toString(): string {
    return this.value;
  }

}

/**
 * MessageDigest ::= OCTET STRING
 *
 * messageDigest ATTRIBUTE ::= {
 *         WITH SYNTAX MessageDigest
 *         EQUALITY MATCHING RULE octetStringMatch
 *         SINGLE VALUE TRUE
 *         ID pkcs-9-at-messageDigest
 * }
 */
export class MessageDigest extends OctetString { }

/**
 * SigningTime ::= Time -- imported from ISO/IEC 9594-8
 *
 * signingTime ATTRIBUTE ::= {
 *         WITH SYNTAX SigningTime
 *         EQUALITY MATCHING RULE signingTimeMatch
 *         SINGLE VALUE TRUE
 *         ID pkcs-9-at-signingTime
 * }
 */
@AsnType({ type: AsnTypeTypes.Choice })
export class SigningTime extends x509.Time { }

/**
 * RandomNonce ::= OCTET STRING (SIZE(4..MAX))
 *         -- At least four bytes long
 *
 * randomNonce ATTRIBUTE ::= {
 *         WITH SYNTAX RandomNonce
 *         EQUALITY MATCHING RULE octetStringMatch
 *         SINGLE VALUE TRUE
 *         ID pkcs-9-at-randomNonce
 * }
 */
export class RandomNonce extends OctetString { }

/**
 * SequenceNumber ::= INTEGER (1..MAX)
 *
 * sequenceNumber ATTRIBUTE ::= {
 *         WITH SYNTAX SequenceNumber
 *         EQUALITY MATCHING RULE integerMatch
 *         SINGLE VALUE TRUE
 *         ID pkcs-9-at-sequenceNumber
 * }
 */
@AsnType({ type: AsnTypeTypes.Choice })
export class SequenceNumber {

  @AsnProp({ type: AsnPropTypes.Integer })
  public value: number;

  public constructor(value = 0) {
    this.value = value;
  }

  /**
   * Returns a string representation of an object.
   */
  public toString(): string {
    return this.value.toString();
  }
}

/**
 * counterSignature ATTRIBUTE ::= {
 *         WITH SYNTAX SignerInfo
 *         ID pkcs-9-at-counterSignature
 * }
 */
@AsnType({ type: AsnTypeTypes.Sequence })
export class CounterSignature extends cms.SignerInfo { }

/**
 * challengePassword ATTRIBUTE ::= {
 *         WITH SYNTAX DirectoryString {pkcs-9-ub-challengePassword}
 *         EQUALITY MATCHING RULE caseExactMatch
 *         SINGLE VALUE TRUE
 *         ID pkcs-9-at-challengePassword
 * }
 */
@AsnType({ type: AsnTypeTypes.Choice })
export class ChallengePassword extends x509.DirectoryString { }

/**
 * ExtensionRequest ::= Extensions
 *
 * extensionRequest ATTRIBUTE ::= {
 *         WITH SYNTAX ExtensionRequest
 *         SINGLE VALUE TRUE
 *         ID pkcs-9-at-extensionRequest
 * }
 */
@AsnType({ type: AsnTypeTypes.Sequence })
export class ExtensionRequest extends x509.Extensions {

  constructor(items?: x509.Extension[]) {
    super(items);

    // Set the prototype explicitly.
    Object.setPrototypeOf(this, ExtensionRequest.prototype);
  }

}
/**
 * extendedCertificateAttributes ATTRIBUTE ::= {
 *         WITH SYNTAX SET OF Attribute
 *         SINGLE VALUE TRUE
 *         ID pkcs-9-at-extendedCertificateAttributes
 * }
 */
@AsnType({ type: AsnTypeTypes.Set, itemType: cms.Attribute })
export class ExtendedCertificateAttributes extends AsnArray<cms.Attribute> {

  constructor(items?: cms.Attribute[]) {
    super(items);

    // Set the prototype explicitly.
    Object.setPrototypeOf(this, ExtendedCertificateAttributes.prototype);
  }

}

/**
 * friendlyName ATTRIBUTE ::= {
 *         WITH SYNTAX BMPString (SIZE(1..pkcs-9-ub-friendlyName))
 *         EQUALITY MATCHING RULE caseIgnoreMatch
 *         SINGLE VALUE TRUE
 *         ID pkcs-9-at-friendlyName
 * }
 */
@AsnType({ type: AsnTypeTypes.Choice })
export class FriendlyName {

  @AsnProp({ type: AsnPropTypes.BmpString })
  public value: string;

  public constructor(value = "") {
    this.value = value;
  }

  /**
   * Returns a string representation of an object.
   */
  public toString(): string {
    return this.value;
  }

}

/**
 * localKeyId ATTRIBUTE ::= {
 *         WITH SYNTAX OCTET STRING
 *         EQUALITY MATCHING RULE octetStringMatch
 *         SINGLE VALUE TRUE
 *         ID pkcs-9-at-localKeyId
 * }
 */
export class LocalKeyId extends OctetString { }

/**
 * signingDescription ATTRIBUTE ::= {
 *         WITH SYNTAX DirectoryString {pkcs-9-ub-signingDescription}
 *         EQUALITY MATCHING RULE caseIgnoreMatch
 *         SINGLE VALUE TRUE
 *         ID pkcs-9-at-signingDescription
 * }
 */
export class SigningDescription extends x509.DirectoryString { }

/**
 * SMIMECapability ::= SEQUENCE {
 *         algorithm  ALGORITHM.&id ({SMIMEv3Algorithms}),
 *         parameters ALGORITHM.&Type ({SMIMEv3Algorithms}{@algorithm})
 * }
 *
 * SMIMEv3Algorithms ALGORITHM ::= {...-- See RFC 2633 --}
 */
@AsnType({ type: AsnTypeTypes.Sequence })
export class SMIMECapability extends x509.AlgorithmIdentifier { }

/**
 * SMIMECapabilities ::= SEQUENCE OF SMIMECapability
 *
 * smimeCapabilities ATTRIBUTE ::= {
 *         WITH SYNTAX SMIMECapabilities
 *         SINGLE VALUE TRUE
 *         ID pkcs-9-at-smimeCapabilities
 * }
 */
@AsnType({ type: AsnTypeTypes.Sequence, itemType: SMIMECapability })
export class SMIMECapabilities extends AsnArray<SMIMECapability> {

  constructor(items?: SMIMECapability[]) {
    super(items);

    // Set the prototype explicitly.
    Object.setPrototypeOf(this, SMIMECapabilities.prototype);
  }

}

/**
 *  -- Matching rules
 *
 * pkcs9CaseIgnoreMatch MATCHING-RULE ::= {
 *         SYNTAX PKCS9String {pkcs-9-ub-match}
 *         ID pkcs-9-mr-caseIgnoreMatch
 * }
 *
 * signingTimeMatch MATCHING-RULE ::= {
 *         SYNTAX SigningTime
 *         ID pkcs-9-mr-signingTimeMatch
 * }
 *
 * END
 */
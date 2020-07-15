import { AsnProp, AsnPropTypes, AsnType, AsnTypeTypes, AsnArray } from "@peculiar/asn1-schema";
import { id_ce } from "../object_identifiers";

/**
 * ```
 * id-ce-certificatePolicies OBJECT IDENTIFIER ::=  { id-ce 32 }
 * ```
 */
export const id_ce_certificatePolicies = `${id_ce}.32`;

/**
 * ```
 * anyPolicy OBJECT IDENTIFIER ::= { id-ce-certificatePolicies 0 }
 * ```
 */
export const id_ce_certificatePolicies_anyPolicy = `${id_ce_certificatePolicies}.0`;

/**
 * ```
 * DisplayText ::= CHOICE {
 *      ia5String        IA5String      (SIZE (1..200)),
 *      visibleString    VisibleString  (SIZE (1..200)),
 *      bmpString        BMPString      (SIZE (1..200)),
 *      utf8String       UTF8String     (SIZE (1..200)) }
 * ```
 */
@AsnType({ type: AsnTypeTypes.Choice })
export class DisplayText {

  @AsnProp({ type: AsnPropTypes.IA5String })
  public ia5String?: string;

  @AsnProp({ type: AsnPropTypes.VisibleString })
  public visibleString?: string;

  @AsnProp({ type: AsnPropTypes.BmpString })
  public bmpString?: string;

  @AsnProp({ type: AsnPropTypes.Utf8String })
  public utf8String?: string;

  constructor(params: Partial<DisplayText> = {}) {
    Object.assign(this, params);
  }

  public toString() {
    return this.ia5String || this.visibleString || this.bmpString || this.utf8String
      "";
  }
}

/**
 * ```
 * NoticeReference ::= SEQUENCE {
 *      organization     DisplayText,
 *      noticeNumbers    SEQUENCE OF INTEGER }
 * ```
 */
export class NoticeReference {

  @AsnProp({ type: DisplayText })
  public organization = new DisplayText();

  @AsnProp({ type: AsnPropTypes.Integer, repeated: "sequence" })
  public noticeNumbers: number[] = [];

  constructor(params: Partial<NoticeReference> = {}) {
    Object.assign(this, params);
  }
}

/**
 * ```
 * UserNotice ::= SEQUENCE {
 *      noticeRef        NoticeReference OPTIONAL,
 *      explicitText     DisplayText OPTIONAL }
 * ```
 */
export class UserNotice {

  @AsnProp({ type: NoticeReference, optional: true })
  public noticeRef?: NoticeReference;

  @AsnProp({ type: DisplayText, optional: true })
  public explicitText?: DisplayText;

  constructor(params: Partial<UserNotice> = {}) {
    Object.assign(this, params);
  }
}

/**
 * ```
 * CPSuri ::= IA5String
 * ```
 */
export type CPSuri = string;

/**
 * ```
 * Qualifier ::= CHOICE {
 *      cPSuri           CPSuri,
 *      userNotice       UserNotice }
 * ```
 */
@AsnType({ type: AsnTypeTypes.Choice })
export class Qualifier {

  @AsnProp({ type: AsnPropTypes.IA5String })
  public cPSuri?: CPSuri;

  @AsnProp({ type: UserNotice })
  public userNotice?: UserNotice;

  constructor(params: Partial<Qualifier> = {}) {
    Object.assign(this, params);
  }
}

/**
 * ```
 * PolicyQualifierId ::= OBJECT IDENTIFIER ( id-qt-cps | id-qt-unotice )
 * ```
 */
export type PolicyQualifierId = string;

/**
 * ```
 * PolicyQualifierInfo ::= SEQUENCE {
 *      policyQualifierId  PolicyQualifierId,
 *      qualifier          ANY DEFINED BY policyQualifierId }
 * ```
 */
export class PolicyQualifierInfo {

  @AsnProp({ type: AsnPropTypes.ObjectIdentifier })
  public policyQualifierId: PolicyQualifierId = "";

  @AsnProp({ type: AsnPropTypes.Any })
  public qualifier = new ArrayBuffer(0);

  constructor(params: Partial<PolicyQualifierInfo> = {}) {
    Object.assign(this, params);
  }
}

/**
 * ```
 * CertPolicyId ::= OBJECT IDENTIFIER
 * ```
 */
export type CertPolicyId = string;

/**
 * ```
 * PolicyInformation ::= SEQUENCE {
 *      policyIdentifier   CertPolicyId,
 *      policyQualifiers   SEQUENCE SIZE (1..MAX) OF
 *                              PolicyQualifierInfo OPTIONAL }
 * ```
 */
export class PolicyInformation {
  @AsnProp({ type: AsnPropTypes.ObjectIdentifier })
  public policyIdentifier: CertPolicyId = "";

  @AsnProp({ type: PolicyQualifierInfo, repeated: "sequence", optional: true })
  public policyQualifiers?: PolicyQualifierInfo[];

  constructor(params: Partial<PolicyInformation> = {}) {
    Object.assign(this, params);
  }
}

/**
 * ```
 * CertificatePolicies ::= SEQUENCE SIZE (1..MAX) OF PolicyInformation
 * ```
 */
@AsnType({ type: AsnTypeTypes.Sequence, itemType: PolicyInformation })
export class CertificatePolicies extends AsnArray<PolicyInformation> { }

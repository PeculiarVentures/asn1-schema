import { AsnProp, AsnPropTypes, AsnType, AsnTypeTypes, AsnArray } from "@peculiar/asn1-schema";
import { SecurityClassification } from "./types";
import { SecurityCategories } from "./security_category";

/**
 * ```asn1
 * ESSPrivacyMark ::= CHOICE {
 *     pString      PrintableString (SIZE (1..ub-privacy-mark-length)),
 *     utf8String   UTF8String (SIZE (1..MAX))
 * }
 * ```
 * @todo - is there a way to enforce the size constraint?
 */
@AsnType({ type: AsnTypeTypes.Choice })
export class ESSPrivacyMark {
  @AsnProp({ type: AsnPropTypes.PrintableString })
  public pString?: string;

  @AsnProp({ type: AsnPropTypes.Utf8String })
  public utf8String?: string;

  constructor(params: Partial<ESSPrivacyMark> = {}) {
    // @todo - is this ok? Other `Choice` implementations attempt to discern the type and assign it to the right prop
    // but that doesn't look like it will be possible with these string types?
    Object.assign(this, params);
  }
}

/**
 * ```asn1
 * ESSSecurityLabel ::= SET {
 *   security-policy-identifier SecurityPolicyIdentifier,
 *   security-classification SecurityClassification OPTIONAL,
 *   privacy-mark ESSPrivacyMark OPTIONAL,
 *   security-categories SecurityCategories OPTIONAL }
 * ```
 */
@AsnType({ type: AsnTypeTypes.Set })
export class ESSSecurityLabel {
  @AsnProp({ type: AsnPropTypes.ObjectIdentifier })
  public securityPolicyIdentifier = "";

  @AsnProp({ type: AsnPropTypes.Integer, optional: true })
  public securityClassification?: SecurityClassification;

  @AsnProp({ type: ESSPrivacyMark, optional: true })
  public privacyMark?: ESSPrivacyMark;

  @AsnProp({ type: SecurityCategories, optional: true })
  public securityCategories?: SecurityCategories;

  constructor(params: Partial<ESSSecurityLabel> = {}) {
    Object.assign(this, params);
  }
}

/**
 * ```asn1
 * EquivalentLabels ::= SEQUENCE OF ESSSecurityLabel
 * ```
 */
@AsnType({ type: AsnTypeTypes.Sequence, itemType: ESSSecurityLabel })
export class EquivalentLabels extends AsnArray<ESSSecurityLabel> {
  constructor(items?: ESSSecurityLabel[]) {
    super(items);

    // Set the prototype explicitly.
    Object.setPrototypeOf(this, EquivalentLabels.prototype);
  }
}

import { AsnProp, AsnPropTypes, AsnType, AsnTypeTypes, AsnArray } from "@peculiar/asn1-schema";

/**
 * ```
 * OtherRevocationInfoFormat ::= SEQUENCE {
 *   otherRevInfoFormat OBJECT IDENTIFIER,
 *   otherRevInfo ANY DEFINED BY otherRevInfoFormat }
 * ```
 */
export class OtherRevocationInfoFormat {

  @AsnProp({ type: AsnPropTypes.ObjectIdentifier })
  public otherRevInfoFormat: string = "";

  @AsnProp({ type: AsnPropTypes.Any })
  public otherRevInfo = new ArrayBuffer(0);

  constructor(params: Partial<OtherRevocationInfoFormat> = {}) {
    Object.assign(this, params);
  }
}

/**
 * ```
 * RevocationInfoChoice ::= CHOICE {
 *   crl CertificateList,
 *   other [1] IMPLICIT OtherRevocationInfoFormat }
 * ```
 */
@AsnType({ type: AsnTypeTypes.Choice })
export class RevocationInfoChoice {

  @AsnProp({ type: OtherRevocationInfoFormat, context: 1, implicit: true })
  public other = new OtherRevocationInfoFormat();

  constructor(params: Partial<RevocationInfoChoice> = {}) {
    Object.assign(this, params);
  }
}
/**
 * ```
 * RevocationInfoChoices ::= SET OF RevocationInfoChoice
 * ```
 */
@AsnType({ type: AsnTypeTypes.Set, itemType: RevocationInfoChoice })
export class RevocationInfoChoices extends AsnArray<RevocationInfoChoice> { }

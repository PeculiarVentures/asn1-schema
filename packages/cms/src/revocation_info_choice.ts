import { AsnProp, AsnPropTypes, AsnType, AsnTypeTypes, AsnArray } from "@peculiar/asn1-schema";
import { id_pkix } from "@peculiar/asn1-x509";

/**
 * ```asn
 * id-ri OBJECT IDENTIFIER  ::=
 *               { iso(1) identified-organization(3)
     dod(6) internet(1) security(5) mechanisms(5) pkix(7) ri(16) }
 * ```
 */
export const id_ri = `${id_pkix}.16`;

/**
 * ```asn
 * id-ri-ocsp-response OBJECT IDENTIFIER ::= { id-ri 2 }
 * ```
 */
export const id_ri_ocsp_response = `${id_ri}.2`;

/**
 * ```asn
 * id-ri-scvp OBJECT IDENTIFIER ::= { id-ri 4 }
 * ```
 */
export const id_ri_scvp = `${id_ri}.4`;

/**
 * ```asn
 * OtherRevocationInfoFormat ::= SEQUENCE {
 *   otherRevInfoFormat OBJECT IDENTIFIER,
 *   otherRevInfo ANY DEFINED BY otherRevInfoFormat }
 * ```
 */
export class OtherRevocationInfoFormat {
  @AsnProp({ type: AsnPropTypes.ObjectIdentifier })
  public otherRevInfoFormat = "";

  @AsnProp({ type: AsnPropTypes.Any })
  public otherRevInfo = new ArrayBuffer(0);

  constructor(params: Partial<OtherRevocationInfoFormat> = {}) {
    Object.assign(this, params);
  }
}

/**
 * ```asn
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
 * ```asn
 * RevocationInfoChoices ::= SET OF RevocationInfoChoice
 * ```
 */
@AsnType({ type: AsnTypeTypes.Set, itemType: RevocationInfoChoice })
export class RevocationInfoChoices extends AsnArray<RevocationInfoChoice> {
  constructor(items?: RevocationInfoChoice[]) {
    super(items);

    // Set the prototype explicitly.
    Object.setPrototypeOf(this, RevocationInfoChoices.prototype);
  }
}

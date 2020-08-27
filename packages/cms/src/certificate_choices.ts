import { AsnType, AsnTypeTypes, AsnProp, AsnPropTypes, AsnArray } from "@peculiar/asn1-schema";
import { Certificate } from "@peculiar/asn1-x509";
import { AttributeCertificate } from '@peculiar/asn1-x509-attr';
/**
 * ```
 * OtherCertificateFormat ::= SEQUENCE {
 *   otherCertFormat OBJECT IDENTIFIER,
 *   otherCert ANY DEFINED BY otherCertFormat }
 * ```
 */
export class OtherCertificateFormat {

  @AsnProp({ type: AsnPropTypes.ObjectIdentifier })
  public otherCertFormat: string = "";

  @AsnProp({ type: AsnPropTypes.Any })
  public otherCert = new ArrayBuffer(0);

  constructor(params: Partial<OtherCertificateFormat> = {}) {
    Object.assign(this, params);
  }
}

/**
 * ```
 * CertificateChoices ::= CHOICE {
 *   certificate Certificate,
 *   extendedCertificate [0] IMPLICIT ExtendedCertificate,  -- Obsolete
 *   v1AttrCert [1] IMPLICIT AttributeCertificateV1,        -- Obsolete
 *   v2AttrCert [2] IMPLICIT AttributeCertificateV2,
 *   other [3] IMPLICIT OtherCertificateFormat }
 * ```
 */
@AsnType({ type: AsnTypeTypes.Choice })
export class CertificateChoices {

  @AsnProp({ type: Certificate })
  public certificate?: Certificate;

  // TODO ExtendedCertificate
  // @AsnProp({ type: ExtendedCertificate, context: 0, implicit: true })
  // public extendedCertificate?: ExtendedCertificate;

  // TODO AttributeCertificateV1
  // @AsnProp({ type: AttributeCertificateV1, context: 1, implicit: true })
  // public v1AttrCert?: AttributeCertificateV1;

  @AsnProp({ type: AttributeCertificate, context: 2, implicit: true })
  public v2AttrCert?: AttributeCertificate;

  @AsnProp({ type: OtherCertificateFormat, context: 3, implicit: true })
  public other?: OtherCertificateFormat;

  constructor(params: Partial<CertificateChoices> = {}) {
    Object.assign(this, params);
  }
}

/**
 * ```
 * CertificateSet ::= SET OF CertificateChoices
 * ```
 */
@AsnType({type: AsnTypeTypes.Set, itemType: CertificateChoices})
export class CertificateSet extends AsnArray<CertificateChoices> { 

  constructor(items?: CertificateChoices[]) {
    super(items);

    // Set the prototype explicitly.
    Object.setPrototypeOf(this, CertificateSet.prototype);
  }

}

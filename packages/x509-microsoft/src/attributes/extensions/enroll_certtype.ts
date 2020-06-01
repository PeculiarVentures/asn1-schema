import { AsnProp, AsnPropTypes, AsnType, AsnTypeTypes } from "@peculiar/asn1-schema";

export const id_enrollCertType = "1.3.6.1.4.1.311.20.2";

/**
 * ```
 * CertificateTemplateName ::= SEQUENCE {
 *   Name            UTF8String
 * }
 * ```
 */
export class EnrollCertType {

  @AsnProp({ type: AsnPropTypes.Utf8String })
  public name = "";

  constructor(params: Partial<EnrollCertType> = {}) {
    Object.assign(this, params);
  }
}

/**
 * ```
 * CertificateTemplateNameChoice ::= CHOICE {
 *   name            BMPString
 *   spec            CertificateTemplateName
 * }
 *
 * ```
 * NOTE:
 * BMPString is used in practice
 */
@AsnType({type: AsnTypeTypes.Choice})
export class EnrollCertTypeChoice {

  @AsnProp({ type: AsnPropTypes.BmpString })
  public name?: string;

  @AsnProp({ type: EnrollCertType })
  public spec?: EnrollCertType;

  constructor(params: Partial<EnrollCertTypeChoice> = {}) {
    Object.assign(this, params);
  }
}

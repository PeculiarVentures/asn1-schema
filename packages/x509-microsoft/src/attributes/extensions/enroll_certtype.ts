import { AsnProp, AsnPropTypes, AsnType, AsnTypeTypes } from "@peculiar/asn1-schema";
import { DirectoryString } from "@peculiar/asn1-x509";

export const id_enrollCertType = "1.3.6.1.4.1.311.20.2";

/**
 * ```asn1
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
 * ```asn1
 * CertificateTemplateNameChoice ::= CHOICE {
 *   name            BMPString
 *   spec            CertificateTemplateName
 * }
 *
 * ```
 * NOTE:
 * BMPString is used in practice
 */
@AsnType({ type: AsnTypeTypes.Choice })
export class EnrollCertTypeChoice {
  @AsnProp({ type: DirectoryString })
  public name?: DirectoryString;

  @AsnProp({ type: EnrollCertType })
  public spec?: EnrollCertType;

  constructor(params: Partial<EnrollCertTypeChoice> = {}) {
    Object.assign(this, params);
  }

  /**
   * Returns a string representation of an object.
   */
  public toString(): string {
    return this.name?.toString() || this.spec?.name || "";
  }
}

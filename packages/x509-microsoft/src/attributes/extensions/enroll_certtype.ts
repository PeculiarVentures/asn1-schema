import { AsnProp, AsnPropTypes } from "@peculiar/asn1-schema";

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
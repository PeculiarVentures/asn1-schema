import { AsnProp, AsnPropTypes } from "@peculiar/asn1-schema";

export const id_certificateTemplate = "1.3.6.1.4.1.311.21.7";

/**
 * ```
 * CertificateTemplateOID ::= SEQUENCE {
 *   templateID              OBJECT IDENTIFIER,
 *   templateMajorVersion    INTEGER (0..4294967295) OPTIONAL,
 *   templateMinorVersion    INTEGER (0..4294967295) OPTIONAL
 * } --#public
 * ```
 */
export class CertificateTemplate {

  @AsnProp({ type: AsnPropTypes.ObjectIdentifier })
  public templateID = "";

  @AsnProp({ type: AsnPropTypes.Integer })
  public templateMajorVersion = 0;

  @AsnProp({ type: AsnPropTypes.Integer })
  public templateMinorVersion = 0;

  constructor(params: Partial<CertificateTemplate> = {}) {
    Object.assign(this, params);
  }
}
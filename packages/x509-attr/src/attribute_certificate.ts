import { AsnProp, AsnPropTypes } from "@peculiar/asn1-schema";
import { AlgorithmIdentifier } from "@peculiar/asn1-x509";
import { AttributeCertificateInfo } from "./attribute_certificate_info";

/**
 * ```asn1
 * AttributeCertificate ::= SEQUENCE {
 *      acinfo               AttributeCertificateInfo,
 *      signatureAlgorithm   AlgorithmIdentifier,
 *      signatureValue       BIT STRING
 * }
 * ```
 */
export class AttributeCertificate {
  @AsnProp({ type: AttributeCertificateInfo })
  public acinfo = new AttributeCertificateInfo();

  @AsnProp({ type: AlgorithmIdentifier })
  public signatureAlgorithm = new AlgorithmIdentifier();

  @AsnProp({ type: AsnPropTypes.BitString })
  public signatureValue = new ArrayBuffer(0);

  constructor(params: Partial<AttributeCertificate> = {}) {
    Object.assign(this, params);
  }
}

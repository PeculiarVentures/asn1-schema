import { AsnProp, AsnPropTypes } from "@peculiar/asn1-schema";
import { AlgorithmIdentifier } from "./algorithm_identifier";
import { TBSCertificate } from "./tbs_certificate";

/**
 * ```asn1
 * Certificate  ::=  SEQUENCE  {
 *   tbsCertificate       TBSCertificate,
 *   signatureAlgorithm   AlgorithmIdentifier,
 *   signatureValue       BIT STRING  }
 * ```
 */
export class Certificate {
  @AsnProp({ type: TBSCertificate, raw: true })
  public tbsCertificate = new TBSCertificate();

  public tbsCertificateRaw?: ArrayBuffer;

  @AsnProp({ type: AlgorithmIdentifier })
  public signatureAlgorithm = new AlgorithmIdentifier();

  @AsnProp({ type: AsnPropTypes.BitString })
  public signatureValue: ArrayBuffer = new ArrayBuffer(0);

  constructor(params: Partial<Certificate> = {}) {
    Object.assign(this, params);
  }
}

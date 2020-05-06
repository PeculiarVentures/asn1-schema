import { AsnProp, AsnPropTypes } from "@peculiar/asn1-schema";
import { AlgorithmIdentifier } from "./algorithm_identifier";
import { TBSCertList } from "./tbs_cert_list";

/**
 * ```
 * CertificateList  ::=  SEQUENCE  {
 *   tbsCertList          TBSCertList,
 *   signatureAlgorithm   AlgorithmIdentifier,
 *   signature            BIT STRING  }
 * ```
 */
export class CertificateList {

  @AsnProp({ type: TBSCertList })
  public tbsCertList = new TBSCertList();

  @AsnProp({ type: AlgorithmIdentifier })
  public signatureAlgorithm = new AlgorithmIdentifier();

  @AsnProp({ type: AsnPropTypes.BitString })
  public signature: ArrayBuffer = new ArrayBuffer(0);

  constructor(params: Partial<CertificateList> = {}) {
    Object.assign(this, params);
  }
}

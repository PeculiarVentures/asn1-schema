import { AsnProp, AsnPropTypes } from "@peculiar/asn1-schema";
import { CertificationRequestInfo } from "./certification_request_info";
import { AlgorithmIdentifier } from "@peculiar/asn1-x509";

/**
 * ```
 * CertificationRequest ::= SEQUENCE {
 *   certificationRequestInfo CertificationRequestInfo,
 *   signatureAlgorithm AlgorithmIdentifier{{ SignatureAlgorithms }},
 *   signature          BIT STRING
 * }
 * ```
 */
export class CertificationRequest {

  @AsnProp({ type: CertificationRequestInfo })
  public certificationRequestInfo = new CertificationRequest();

  @AsnProp({ type: AlgorithmIdentifier })
  public signatureAlgorithm = new AlgorithmIdentifier();

  @AsnProp({ type: AsnPropTypes.BitString })
  public signature = new ArrayBuffer(0);

  constructor(params: Partial<CertificationRequest> = {}) {
    Object.assign(this, params);
  }
}

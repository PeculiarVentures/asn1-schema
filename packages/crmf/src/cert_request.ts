import { AsnProp, AsnPropTypes, AsnType, AsnTypeTypes } from "@peculiar/asn1-schema";
import { CertTemplate } from "./cert_template";
import { Controls } from "./controls";

/**
 * ```asn1
 * CertRequest ::= SEQUENCE {
 *  certReqId     INTEGER,          -- ID for matching request and reply
 *  certTemplate  CertTemplate,  -- Selected fields of cert to be issued
 *  controls      Controls OPTIONAL }   -- Attributes affecting issuance
 * ```
 */
@AsnType({ type: AsnTypeTypes.Sequence })
export class CertRequest {
  @AsnProp({ type: AsnPropTypes.Integer })
  public certReqId = 0;

  @AsnProp({ type: CertTemplate })
  public certTemplate = new CertTemplate();

  @AsnProp({ type: Controls, optional: true })
  public controls?: Controls;

  constructor(params: Partial<CertRequest> = {}) {
    Object.assign(this, params);
  }
}

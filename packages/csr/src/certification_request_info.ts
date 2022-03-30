import { AsnProp, AsnPropTypes } from "@peculiar/asn1-schema";
import { Name, SubjectPublicKeyInfo, Attribute } from "@peculiar/asn1-x509";
import { Attributes } from "./attributes";
/**
 * ```
 * CertificationRequestInfo ::= SEQUENCE {
 *   version       INTEGER { v1(0) } (v1,...),
 *   subject       Name,
 *   subjectPKInfo SubjectPublicKeyInfo{{ PKInfoAlgorithms }},
 *   attributes    [0] Attributes{{ CRIAttributes }}
 * }
 * ```
 */
export class CertificationRequestInfo {

  @AsnProp({ type: AsnPropTypes.Integer })
  public version = 0;

  @AsnProp({ type: Name })
  public subject = new Name();

  @AsnProp({ type: SubjectPublicKeyInfo })
  public subjectPKInfo = new SubjectPublicKeyInfo();

  @AsnProp({ type: Attributes, implicit: true, context: 0, optional: true })
  public attributes = new Attributes();

  constructor(params: Partial<CertificationRequestInfo> = {}) {
    Object.assign(this, params);
  }
}

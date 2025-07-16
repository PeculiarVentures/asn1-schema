import { AsnProp, AsnPropTypes, AsnType, AsnTypeTypes } from "@peculiar/asn1-schema";
import { AlgorithmIdentifier, Name, SubjectPublicKeyInfo, Extensions } from "@peculiar/asn1-x509";
import { OptionalValidity } from "./optional_validity";

/**
 * ```asn1
 * CertTemplate ::= SEQUENCE {
 *  version      [0] Version               OPTIONAL,
 *  serialNumber [1] INTEGER               OPTIONAL,
 *  signingAlg   [2] AlgorithmIdentifier   OPTIONAL,
 *  issuer       [3] Name                  OPTIONAL,
 *  validity     [4] OptionalValidity      OPTIONAL,
 *  subject      [5] Name                  OPTIONAL,
 *  publicKey    [6] SubjectPublicKeyInfo  OPTIONAL,
 *  issuerUID    [7] UniqueIdentifier      OPTIONAL,
 *  subjectUID   [8] UniqueIdentifier      OPTIONAL,
 *  extensions   [9] Extensions            OPTIONAL }
 * ```
 */
@AsnType({ type: AsnTypeTypes.Sequence })
export class CertTemplate {
  @AsnProp({ type: AsnPropTypes.Integer, context: 0, optional: true, implicit: true })
  public version?: number;

  @AsnProp({ type: AsnPropTypes.Integer, context: 1, optional: true, implicit: true })
  public serialNumber?: number;

  @AsnProp({ type: AlgorithmIdentifier, context: 2, optional: true, implicit: true })
  public signingAlg?: AlgorithmIdentifier;

  @AsnProp({ type: Name, context: 3, optional: true, implicit: false })
  public issuer?: Name;

  @AsnProp({ type: OptionalValidity, context: 4, optional: true, implicit: true })
  public validity?: OptionalValidity;

  @AsnProp({ type: Name, context: 5, optional: true, implicit: false })
  public subject?: Name;

  @AsnProp({ type: SubjectPublicKeyInfo, context: 6, optional: true, implicit: true })
  public publicKey?: SubjectPublicKeyInfo;

  @AsnProp({ type: AsnPropTypes.BitString, context: 7, optional: true, implicit: true })
  public issuerUID?: ArrayBuffer;

  @AsnProp({ type: AsnPropTypes.BitString, context: 8, optional: true, implicit: true })
  public subjectUID?: ArrayBuffer;

  @AsnProp({ type: Extensions, context: 9, optional: true, implicit: true })
  public extensions?: Extensions;

  constructor(params: Partial<CertTemplate> = {}) {
    Object.assign(this, params);
  }
}

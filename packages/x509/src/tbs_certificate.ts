import { AsnProp, AsnPropTypes, AsnIntegerArrayBufferConverter } from "@peculiar/asn1-schema";
import { AlgorithmIdentifier } from "./algorithm_identifier";
import { Name } from "./name";
import { SubjectPublicKeyInfo } from "./subject_public_key_info";
import { Validity } from "./validity";
import { Extensions } from "./extension";
import { Version, CertificateSerialNumber, UniqueIdentifier } from "./types";

/**
 * ```
 * TBSCertificate  ::=  SEQUENCE  {
 *   version         [0]  Version DEFAULT v1,
 *   serialNumber         CertificateSerialNumber,
 *   signature            AlgorithmIdentifier,
 *   issuer               Name,
 *   validity             Validity,
 *   subject              Name,
 *   subjectPublicKeyInfo SubjectPublicKeyInfo,
 *   issuerUniqueID  [1]  IMPLICIT UniqueIdentifier OPTIONAL,
 *                        -- If present, version MUST be v2 or v3
 *   subjectUniqueID [2]  IMPLICIT UniqueIdentifier OPTIONAL,
 *                        -- If present, version MUST be v2 or v3
 *   extensions      [3]  Extensions OPTIONAL
 *                        -- If present, version MUST be v3 --  }
 * ```
 */
export class TBSCertificate {

  @AsnProp({
    type: AsnPropTypes.Integer,
    context: 0,
    defaultValue: Version.v1,
  })
  public version = Version.v1;

  @AsnProp({
    type: AsnPropTypes.Integer,
    converter: AsnIntegerArrayBufferConverter,
  })
  public serialNumber: CertificateSerialNumber = new ArrayBuffer(0);

  @AsnProp({ type: AlgorithmIdentifier })
  public signature = new AlgorithmIdentifier();

  @AsnProp({ type: Name })
  public issuer = new Name();

  @AsnProp({ type: Validity })
  public validity = new Validity();

  @AsnProp({ type: Name })
  public subject = new Name();

  @AsnProp({ type: SubjectPublicKeyInfo })
  public subjectPublicKeyInfo = new SubjectPublicKeyInfo();

  @AsnProp({
    type: AsnPropTypes.BitString,
    context: 1,
    implicit: true,
    optional: true,
  })
  public issuerUniqueID?: UniqueIdentifier;

  @AsnProp({ type: AsnPropTypes.BitString, context: 2, implicit: true, optional: true })
  public subjectUniqueID?: UniqueIdentifier;

  @AsnProp({ type: Extensions, context: 3, optional: true })
  public extensions?: Extensions;

  constructor(params: Partial<TBSCertificate> = {}) {
    Object.assign(this, params);
  }
}

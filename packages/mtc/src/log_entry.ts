import {
  AsnProp, AsnPropTypes, AsnType, AsnTypeTypes, OctetString,
} from "@peculiar/asn1-schema";
import {
  AlgorithmIdentifier, Extensions, Name, Validity,
} from "@peculiar/asn1-x509";

/**
 * ```asn1
 * TBSCertificateLogEntry ::= SEQUENCE {
 *     version               [0] EXPLICIT Version DEFAULT v1,
 *     issuer                    Name,
 *     validity                  Validity,
 *     subject                   Name,
 *     subjectPublicKeyAlgorithm AlgorithmIdentifier{PUBLIC-KEY, {PublicKeyAlgorithms}},
 *     subjectPublicKeyInfoHash  OCTET STRING,
 *     issuerUniqueID        [1] IMPLICIT UniqueIdentifier OPTIONAL,
 *     subjectUniqueID       [2] IMPLICIT UniqueIdentifier OPTIONAL,
 *     extensions            [3] EXPLICIT Extensions{{CertExtensions}} OPTIONAL
 * }
 * ```
 *
 * The issuance log entry. It carries a hash of the subject public key rather
 * than the key itself, and no signature, so entry size does not scale with
 * post-quantum key and signature sizes.
 */
@AsnType({ type: AsnTypeTypes.Sequence })
export class TBSCertificateLogEntry {
  @AsnProp({
    type: AsnPropTypes.Integer, context: 0, defaultValue: 0,
  })
  public version = 0;

  @AsnProp({ type: Name })
  public issuer = new Name();

  @AsnProp({ type: Validity })
  public validity = new Validity();

  @AsnProp({ type: Name })
  public subject = new Name();

  @AsnProp({ type: AlgorithmIdentifier })
  public subjectPublicKeyAlgorithm = new AlgorithmIdentifier();

  @AsnProp({ type: OctetString })
  public subjectPublicKeyInfoHash = new OctetString();

  @AsnProp({
    type: AsnPropTypes.BitString, context: 1, implicit: true, optional: true,
  })
  public issuerUniqueID?: ArrayBuffer;

  @AsnProp({
    type: AsnPropTypes.BitString, context: 2, implicit: true, optional: true,
  })
  public subjectUniqueID?: ArrayBuffer;

  @AsnProp({
    type: Extensions, context: 3, optional: true,
  })
  public extensions?: Extensions;

  constructor(params: Partial<TBSCertificateLogEntry> = {}) {
    Object.assign(this, params);
  }
}

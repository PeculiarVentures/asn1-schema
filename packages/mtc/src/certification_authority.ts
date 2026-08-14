import { AsnIntegerBigIntConverter, AsnProp, AsnPropTypes } from "@peculiar/asn1-schema";
import { AlgorithmIdentifier } from "@peculiar/asn1-x509";

/**
 * ```asn1
 * MTCCertificationAuthority ::= SEQUENCE {
 *     logHash   AlgorithmIdentifier{DIGEST-ALGORITHM, {...}},
 *     sigAlg    AlgorithmIdentifier{SIGNATURE-ALGORITHM, {...}},
 *     minSerial INTEGER (0..mtcMaxSerial),
 *     maxSerial INTEGER (0..mtcMaxSerial)
 * }
 * ```
 *
 * Value of the critical `id-pe-mtcCertificationAuthority` extension. Its
 * presence means the subject public key is a CA cosigner key, which MUST NOT
 * be used to sign `TBSCertificate` structures directly.
 *
 * `minSerial` and `maxSerial` range over `0..2^64-1`, beyond the safe integer
 * range, so they use the BigInt converter.
 */
export class MTCCertificationAuthority {
  @AsnProp({ type: AlgorithmIdentifier })
  public logHash = new AlgorithmIdentifier();

  @AsnProp({ type: AlgorithmIdentifier })
  public sigAlg = new AlgorithmIdentifier();

  @AsnProp({
    type: AsnPropTypes.Integer,
    converter: AsnIntegerBigIntConverter,
  })
  public minSerial = 0n;

  @AsnProp({
    type: AsnPropTypes.Integer,
    converter: AsnIntegerBigIntConverter,
  })
  public maxSerial = 0n;

  constructor(params: Partial<MTCCertificationAuthority> = {}) {
    Object.assign(this, params);
  }
}

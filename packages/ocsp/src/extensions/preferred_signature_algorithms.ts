import { AsnProp, AsnArray, AsnType, AsnTypeTypes } from "@peculiar/asn1-schema";
import { AlgorithmIdentifier } from "@peculiar/asn1-x509";

// re-ocsp-preferred-signature-algorithms EXTENSION ::= {
//   SYNTAX PreferredSignatureAlgorithms
//   IDENTIFIED BY id-pkix-ocsp-pref-sig-algs  }

/**
 * ```asn1
 * PreferredSignatureAlgorithm ::= SEQUENCE {
 *    sigIdentifier  AlgorithmIdentifier{SIGNATURE-ALGORITHM, {...}},
 *    certIdentifier AlgorithmIdentifier{PUBLIC-KEY, {...}} OPTIONAL
 * ```
 */
export class PreferredSignatureAlgorithm {
  @AsnProp({ type: AlgorithmIdentifier })
  public sigIdentifier = new AlgorithmIdentifier();

  @AsnProp({ type: AlgorithmIdentifier, optional: true })
  public certIdentifier?: AlgorithmIdentifier;

  constructor(params: Partial<PreferredSignatureAlgorithm> = {}) {
    Object.assign(this, params);
  }
}

/**
 * ```asn1
 * PreferredSignatureAlgorithms ::= SEQUENCE OF PreferredSignatureAlgorithm
 * ```
 */
@AsnType({ type: AsnTypeTypes.Sequence, itemType: PreferredSignatureAlgorithm })
export class PreferredSignatureAlgorithms extends AsnArray<PreferredSignatureAlgorithm> {
  constructor(items?: PreferredSignatureAlgorithm[]) {
    super(items);

    // Set the prototype explicitly.
    Object.setPrototypeOf(this, PreferredSignatureAlgorithms.prototype);
  }
}

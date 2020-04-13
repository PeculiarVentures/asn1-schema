import { AsnProp } from "@peculiar/asn1-schema";
import { AlgorithmIdentifier } from "@peculiar/asn1-x509";

// re-ocsp-preferred-signature-algorithms EXTENSION ::= {
//   SYNTAX PreferredSignatureAlgorithms
//   IDENTIFIED BY id-pkix-ocsp-pref-sig-algs  }

/** 
 * ```
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
    Object.assign(this, params)
  }
}

/**
 * ```
 * PreferredSignatureAlgorithms ::= SEQUENCE OF PreferredSignatureAlgorithm
 * ```
 */
export class PreferredSignatureAlgorithms {

  @AsnProp({ type: AlgorithmIdentifier, repeated: true })
  public items: PreferredSignatureAlgorithm[];

  constructor(items: PreferredSignatureAlgorithm[] = []) {
    this.items = items;
  }
}

import { AsnArray, AsnPropTypes, AsnType, AsnTypeTypes } from "@peculiar/asn1-schema";
import { AlgorithmIdentifier } from "@peculiar/asn1-x509";

/**
 * ```asn
 * id-alg-composite OBJECT IDENTIFIER ::= {
 *     iso(1) identified-organization(3) dod(6) internet(1) private(4)
 *     enterprise(1) OpenCA(18227) Algorithms(2) id-alg-composite(1)
 * ```
 */
export const id_alg_composite = "1.3.6.1.4.1.18227.2.1";

/**
 * ```asn
 * CompositeParams ::= SEQUENCE SIZE (2..MAX) OF AlgorithmIdentifier
 * ```
 */
@AsnType({ type: AsnTypeTypes.Sequence, itemType: AlgorithmIdentifier })
export class CompositeParams extends AsnArray<AlgorithmIdentifier> {

  constructor(items?: AlgorithmIdentifier[]) {
    super(items);

    // Set the prototype explicitly.
    Object.setPrototypeOf(this, CompositeParams.prototype);
  }

}

/**
 * ```asn
 * CompositeSignatureValue ::= SEQUENCE SIZE (2..MAX) OF BIT STRING
 * ```
 */
@AsnType({ type: AsnTypeTypes.Sequence, itemType: AsnPropTypes.BitString })
export class CompositeSignatureValue extends AsnArray<ArrayBuffer>{

  constructor(items?: ArrayBuffer[]) {
    super(items);

    // Set the prototype explicitly.
    Object.setPrototypeOf(this, CompositeSignatureValue.prototype);
  }

}

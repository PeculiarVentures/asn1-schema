import { AsnProp, AsnPropTypes } from "@peculiar/asn1-schema";
import { AlgorithmIdentifier } from "./algorithm_identifier";

/**
 * ```asn1
 * SubjectPublicKeyInfo  ::=  SEQUENCE  {
 *   algorithm            AlgorithmIdentifier,
 *   subjectPublicKey     BIT STRING  }
 * ```
 */
export class SubjectPublicKeyInfo {
  @AsnProp({ type: AlgorithmIdentifier })
  public algorithm = new AlgorithmIdentifier();

  @AsnProp({ type: AsnPropTypes.BitString })
  public subjectPublicKey: ArrayBuffer = new ArrayBuffer(0);

  constructor(params: Partial<SubjectPublicKeyInfo> = {}) {
    Object.assign(this, params);
  }
}

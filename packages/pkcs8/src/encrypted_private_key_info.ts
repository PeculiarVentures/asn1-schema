import { AsnProp, AsnPropTypes } from "@peculiar/asn1-schema";
import { AlgorithmIdentifier } from "@peculiar/asn1-x509";

/**
 * ```
 * EncryptedData ::= OCTET STRING
 * ```
 */
export type EncryptedData = ArrayBuffer;

/**
 * ```
 * EncryptedPrivateKeyInfo ::= SEQUENCE {
 *   encryptionAlgorithm AlgorithmIdentifier {{KeyEncryptionAlgorithms}},
 *   encryptedData EncryptedData
 * }
 * ```
 */
export class EncryptedPrivateKeyInfo {

  @AsnProp({ type: AlgorithmIdentifier })
  public encryptionAlgorithm = new AlgorithmIdentifier();

  @AsnProp({ type: AsnPropTypes.OctetString })
  public encryptedData: EncryptedData = new ArrayBuffer(0);

  constructor(params: Partial<EncryptedPrivateKeyInfo> = {}) {
    Object.assign(this, params);
  }
}

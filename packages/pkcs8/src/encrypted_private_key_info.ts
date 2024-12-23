import { AsnProp, OctetString } from "@peculiar/asn1-schema";
import { AlgorithmIdentifier } from "@peculiar/asn1-x509";

/**
 * ```asn1
 * EncryptedData ::= OCTET STRING
 * ```
 */
export class EncryptedData extends OctetString {}

/**
 * ```asn1
 * EncryptedPrivateKeyInfo ::= SEQUENCE {
 *   encryptionAlgorithm AlgorithmIdentifier {{KeyEncryptionAlgorithms}},
 *   encryptedData EncryptedData
 * }
 * ```
 */
export class EncryptedPrivateKeyInfo {
  @AsnProp({ type: AlgorithmIdentifier })
  public encryptionAlgorithm = new AlgorithmIdentifier();

  @AsnProp({ type: EncryptedData })
  public encryptedData = new EncryptedData();

  constructor(params: Partial<EncryptedPrivateKeyInfo> = {}) {
    Object.assign(this, params);
  }
}

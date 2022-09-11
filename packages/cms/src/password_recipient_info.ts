import { AsnProp, AsnPropTypes, OctetString } from "@peculiar/asn1-schema";
import { CMSVersion, KeyDerivationAlgorithmIdentifier, KeyEncryptionAlgorithmIdentifier, EncryptedKey } from "./types";

/**
 * ```asn
 * PasswordRecipientInfo ::= SEQUENCE {
 *  version CMSVersion,   -- Always set to 0
 *  keyDerivationAlgorithm [0] KeyDerivationAlgorithmIdentifier OPTIONAL,
 *  keyEncryptionAlgorithm KeyEncryptionAlgorithmIdentifier,
 *  encryptedKey EncryptedKey }
 * ```
 */
export class PasswordRecipientInfo {

  @AsnProp({ type: AsnPropTypes.Integer })
  public version: CMSVersion = CMSVersion.v0;

  @AsnProp({ type: KeyDerivationAlgorithmIdentifier, context: 0, optional: true })
  public keyDerivationAlgorithm?: KeyDerivationAlgorithmIdentifier;

  @AsnProp({ type: KeyEncryptionAlgorithmIdentifier })
  public keyEncryptionAlgorithm = new KeyEncryptionAlgorithmIdentifier();

  @AsnProp({ type: OctetString })
  public encryptedKey: EncryptedKey = new OctetString();

  constructor(params: Partial<PasswordRecipientInfo> = {}) {
    Object.assign(this, params);
  }
}
import { AsnProp, AsnPropTypes, OctetString } from "@peculiar/asn1-schema";
import { OtherKeyAttribute } from "./recipient_info";
import { CMSVersion, EncryptedKey, KeyEncryptionAlgorithmIdentifier } from "./types";

/**
 * KEKIdentifier ::= SEQUENCE {
 *  keyIdentifier OCTET STRING,
 *  date GeneralizedTime OPTIONAL,
 *  other OtherKeyAttribute OPTIONAL }
 */
export class KEKIdentifier {

  @AsnProp({ type: OctetString })
  public keyIdentifier = new OctetString();

  @AsnProp({ type: AsnPropTypes.GeneralizedTime, optional: true })
  public date?: Date;

  @AsnProp({ type: OtherKeyAttribute, optional: true })
  public other?: OtherKeyAttribute;

  constructor(params: Partial<KEKIdentifier> = {}) {
    Object.assign(this, params);
  }
}

/**
 * KEKRecipientInfo ::= SEQUENCE {
 *  version CMSVersion,  -- always set to 4
 *  kekid KEKIdentifier,
 *  keyEncryptionAlgorithm KeyEncryptionAlgorithmIdentifier,
 *  encryptedKey EncryptedKey }
 */
export class KEKRecipientInfo {

  @AsnProp({ type: AsnPropTypes.Integer })
  public version: CMSVersion = CMSVersion.v4;

  @AsnProp({ type: KEKIdentifier })
  public kekid = new KEKIdentifier();

  @AsnProp({ type: KeyEncryptionAlgorithmIdentifier })
  public keyEncryptionAlgorithm = new KeyEncryptionAlgorithmIdentifier();

  @AsnProp({ type: OctetString })
  public encryptedKey: EncryptedKey = new OctetString();

  constructor(params: Partial<KEKRecipientInfo> = {}) {
    Object.assign(this, params);
  }
}
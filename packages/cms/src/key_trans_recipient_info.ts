import { AsnProp, AsnPropTypes, AsnType, AsnTypeTypes, OctetString } from "@peculiar/asn1-schema";
import { CMSVersion, KeyEncryptionAlgorithmIdentifier, EncryptedKey } from "./types";
import { IssuerAndSerialNumber } from "./issuer_and_serial_number";
import { SubjectKeyIdentifier } from "@peculiar/asn1-x509";

/**
 * RecipientIdentifier ::= CHOICE {
 *  issuerAndSerialNumber IssuerAndSerialNumber,
 *  subjectKeyIdentifier [0] SubjectKeyIdentifier }
 */
@AsnType({ type: AsnTypeTypes.Choice })
export class RecipientIdentifier {

  // * Declare subjectKeyIdentifier before issuerAndSerialNumber, because issuerAndSerialNumber is any in schema declaration
  @AsnProp({ type: SubjectKeyIdentifier, context: 0 })
  public subjectKeyIdentifier?: SubjectKeyIdentifier;

  @AsnProp({ type: IssuerAndSerialNumber })
  public issuerAndSerialNumber?: IssuerAndSerialNumber;

  constructor(params: Partial<RecipientIdentifier> = {}) {
    Object.assign(this, params);
  }
}

/**
 * ```
 * KeyTransRecipientInfo ::= SEQUENCE {
 *  version CMSVersion,  -- always set to 0 or 2
 *  rid RecipientIdentifier,
 *  keyEncryptionAlgorithm KeyEncryptionAlgorithmIdentifier,
 *  encryptedKey EncryptedKey }
 * ```
 */
 export class KeyTransRecipientInfo {

  @AsnProp({ type: AsnPropTypes.Integer })
  public version: CMSVersion = CMSVersion.v0;

  @AsnProp({ type: RecipientIdentifier })
  public rid = new RecipientIdentifier();

  @AsnProp({ type: KeyEncryptionAlgorithmIdentifier })
  public keyEncryptionAlgorithm = new KeyEncryptionAlgorithmIdentifier();

  @AsnProp({ type: OctetString })
  public encryptedKey: EncryptedKey = new OctetString();

  constructor(params: Partial<KeyTransRecipientInfo> = {}) {
    Object.assign(this, params);
  }
}
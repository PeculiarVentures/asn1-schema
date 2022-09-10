import { AsnProp, AsnPropTypes, AsnArray, AsnType, AsnTypeTypes } from "@peculiar/asn1-schema";
import { CMSVersion } from "./types";
import { Attribute } from "./attribute";
import { RecipientInfos } from "./recipient_infos";
import { OriginatorInfo } from "./originator_info";
import { EncryptedContentInfo } from "./encrypted_content_info";

/**
 * UnprotectedAttributes ::= SET SIZE (1..MAX) OF Attribute
 */
@AsnType({ type: AsnTypeTypes.Set, itemType: Attribute })
export class UnprotectedAttributes extends AsnArray<Attribute> {

  constructor(items?: Attribute[]) {
    super(items);

    // Set the prototype explicitly.
    Object.setPrototypeOf(this, UnprotectedAttributes.prototype);
  }
}

/**
 * ```
 * EnvelopedData ::= SEQUENCE {
 *  version CMSVersion,
 *  originatorInfo [0] IMPLICIT OriginatorInfo OPTIONAL,
 *  recipientInfos RecipientInfos,
 *  encryptedContentInfo EncryptedContentInfo,
 *  unprotectedAttrs [1] IMPLICIT UnprotectedAttributes OPTIONAL }
 * ```
 */
export class EnvelopedData {

  @AsnProp({ type: AsnPropTypes.Integer })
  public version: CMSVersion = CMSVersion.v0;

  @AsnProp({ type: OriginatorInfo, context: 0, implicit: true, optional: true })
  public originatorInfo?: OriginatorInfo;

  @AsnProp({ type: RecipientInfos })
  public recipientInfos = new RecipientInfos();

  @AsnProp({ type: EncryptedContentInfo })
  public encryptedContentInfo = new EncryptedContentInfo();

  @AsnProp({ type: UnprotectedAttributes, context: 1, implicit: true, optional: true })
  public unprotectedAttrs?: UnprotectedAttributes;

  constructor(params: Partial<EnvelopedData> = {}) {
    Object.assign(this, params);
  }
}

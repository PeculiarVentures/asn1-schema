import { AsnProp, AsnPropTypes, AsnType, AsnTypeTypes } from "@peculiar/asn1-schema";
import { KeyAgreeRecipientInfo } from "./key_agree_recipient_info";
import { KeyTransRecipientInfo } from "./key_trans_recipient_info";
import { KEKRecipientInfo } from "./kek_recipient_info";
import { PasswordRecipientInfo } from "./password_recipient_info";

/**
 * OtherKeyAttribute ::= SEQUENCE {
 *  keyAttrId OBJECT IDENTIFIER,
 *  keyAttr ANY DEFINED BY keyAttrId OPTIONAL }
 */
export class OtherKeyAttribute {

  @AsnProp({ type: AsnPropTypes.ObjectIdentifier })
  public keyAttrId = "";

  @AsnProp({ type: AsnPropTypes.Any, optional: true })
  public keyAttr?: ArrayBuffer;

  constructor(params: Partial<OtherKeyAttribute> = {}) {
    Object.assign(this, params);
  }
}

/**
 * OtherRecipientInfo ::= SEQUENCE {
 *  oriType OBJECT IDENTIFIER,
 *  oriValue ANY DEFINED BY oriType }
 */
export class OtherRecipientInfo {

  @AsnProp({ type: AsnPropTypes.ObjectIdentifier })
  public oriType = "";

  @AsnProp({ type: AsnPropTypes.Any })
  public oriValue = new ArrayBuffer(0);

  constructor(params: Partial<OtherRecipientInfo> = {}) {
    Object.assign(this, params);
  }
}

/**
 * ```
 * RecipientInfo ::= CHOICE {
 *  ktri KeyTransRecipientInfo,
 *  kari [1] KeyAgreeRecipientInfo,
 *  kekri [2] KEKRecipientInfo,
 *  pwri [3] PasswordRecipientInfo,
 *  ori [4] OtherRecipientInfo }
 * ```
 */
@AsnType({ type: AsnTypeTypes.Choice })
export class RecipientInfo {

  @AsnProp({ type: KeyTransRecipientInfo })
  public ktri?: KeyTransRecipientInfo;

  @AsnProp({ type: KeyAgreeRecipientInfo, context: 1 })
  public kari?: KeyAgreeRecipientInfo;

  @AsnProp({ type: KEKRecipientInfo, context: 2 })
  public kekri?: KEKRecipientInfo;

  @AsnProp({ type: PasswordRecipientInfo, context: 3 })
  public pwri?: PasswordRecipientInfo;

  @AsnProp({ type: OtherRecipientInfo, context: 4 })
  public ori?: OtherRecipientInfo;

  constructor(params: Partial<RecipientInfo> = {}) {
    Object.assign(this, params);
  }
}
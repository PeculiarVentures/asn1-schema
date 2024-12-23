import { AsnProp, AsnPropTypes, AsnType, AsnTypeTypes } from "@peculiar/asn1-schema";
import { KeyAgreeRecipientInfo } from "./key_agree_recipient_info";
import { KeyTransRecipientInfo } from "./key_trans_recipient_info";
import { KEKRecipientInfo } from "./kek_recipient_info";
import { PasswordRecipientInfo } from "./password_recipient_info";

/**
 * ```asn
 * OtherRecipientInfo ::= SEQUENCE {
 *  oriType OBJECT IDENTIFIER,
 *  oriValue ANY DEFINED BY oriType }
 * ```
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
 * ```asn
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
  @AsnProp({ type: KeyTransRecipientInfo, optional: true })
  public ktri?: KeyTransRecipientInfo;

  @AsnProp({ type: KeyAgreeRecipientInfo, context: 1, implicit: true, optional: true })
  public kari?: KeyAgreeRecipientInfo;

  @AsnProp({ type: KEKRecipientInfo, context: 2, implicit: true, optional: true })
  public kekri?: KEKRecipientInfo;

  @AsnProp({ type: PasswordRecipientInfo, context: 3, implicit: true, optional: true })
  public pwri?: PasswordRecipientInfo;

  @AsnProp({ type: OtherRecipientInfo, context: 4, implicit: true, optional: true })
  public ori?: OtherRecipientInfo;

  constructor(params: Partial<RecipientInfo> = {}) {
    Object.assign(this, params);
  }
}

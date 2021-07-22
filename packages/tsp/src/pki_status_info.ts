import { AsnArray, AsnProp, AsnPropTypes, AsnType, AsnTypeTypes } from "@peculiar/asn1-schema";
import { PKIFailureInfo } from "./pki_failure_info";
import { PKIStatus } from "./pki_status";

/**
 * ```
 * PKIFreeText ::= SEQUENCE SIZE (1..MAX) OF UTF8String
 * ```
 * @see https://github.com/erlang/otp/blob/master/lib/asn1/test/asn1_SUITE_data/rfcs/PKIXCMP-2009.asn1
 */

@AsnType({ type: AsnTypeTypes.Sequence, itemType: AsnPropTypes.Utf8String })
export class PKIFreeText extends AsnArray<string> {

  constructor(items?: string[]) {
    super(items);

    // Set the prototype explicitly.
    Object.setPrototypeOf(this, PKIFreeText.prototype);
  }

}
/**
 * ```
 * PKIStatusInfo ::= SEQUENCE {
 *  status        PKIStatus,
 *  statusString  PKIFreeText     OPTIONAL,
 *  failInfo      PKIFailureInfo  OPTIONAL  }
 * ```
 */

export class PKIStatusInfo {

  @AsnProp({ type: AsnPropTypes.Integer })
  public status = PKIStatus.granted;

  @AsnProp({ type: PKIFreeText, optional: true })
  public statusString?: PKIFreeText;

  @AsnProp({ type: PKIFailureInfo, optional: true })
  public failInfo?: PKIFailureInfo;

  constructor(params: Partial<PKIStatusInfo> = {}) {
    Object.assign(this, params);
  }

}

import { AsnArray, AsnType, AsnTypeTypes } from "@peculiar/asn1-schema";
import { RecipientInfo } from "./recipient_info";

/**
 * ```asn
 * RecipientInfos ::= SET SIZE (1..MAX) OF RecipientInfo
 * ```
 */
@AsnType({ type: AsnTypeTypes.Set, itemType: RecipientInfo })
export class RecipientInfos extends AsnArray<RecipientInfo> {
  constructor(items?: RecipientInfo[]) {
    super(items);

    // Set the prototype explicitly.
    Object.setPrototypeOf(this, RecipientInfos.prototype);
  }
}

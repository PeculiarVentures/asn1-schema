import { AsnProp, AsnPropTypes, AsnType, AsnTypeTypes } from "@peculiar/asn1-schema";
import { GeneralNames } from "@peculiar/asn1-x509";
import { AllOrFirstTier } from "./types";

/**
 * ```asn1
 * ReceiptsFrom ::= CHOICE {
 *   allOrFirstTier [0] AllOrFirstTier,
 *   -- formerly "allOrNone [0]AllOrNone"
 *   receiptList [1] SEQUENCE OF GeneralNames }
 * ```
 */
@AsnType({ type: AsnTypeTypes.Choice })
export class ReceiptsFrom {
  @AsnProp({ type: AsnPropTypes.Integer, context: 0, implicit: true })
  public allOrFirstTier: AllOrFirstTier = AllOrFirstTier.allReceipts;

  @AsnProp({ type: GeneralNames, repeated: "sequence", context: 1, implicit: true })
  public receiptList: GeneralNames[] = [];

  constructor(params: Partial<ReceiptsFrom> = {}) {
    Object.assign(this, params);
  }
}

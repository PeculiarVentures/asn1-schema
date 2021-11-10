import { AsnType, AsnTypeTypes } from "@peculiar/asn1-schema";
import { id_ce } from "../object_identifiers";
import { CRLDistributionPoints, DistributionPoint } from "./crl_distribution_points";

/**
 * ```
 * id-ce-freshestCRL OBJECT IDENTIFIER ::=  { id-ce 46 }
 * ```
 */
export const id_ce_freshestCRL = `${id_ce}.46`;

/**
 * ```
 * FreshestCRL ::= CRLDistributionPoints
 * ```
 */
 @AsnType({ type: AsnTypeTypes.Sequence, itemType: DistributionPoint })
export class FreshestCRL extends CRLDistributionPoints {

  constructor(items?: DistributionPoint[]) {
    super(items);

    // Set the prototype explicitly.
    Object.setPrototypeOf(this, FreshestCRL.prototype);
  }

}

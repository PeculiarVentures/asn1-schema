import { AsnProp } from "@peculiar/asn1-schema";
import { DistributionPointName, Reason } from "./crl_distribution_points";
import { id_ce } from "../object_identifiers";
import { AsnPropTypes } from "@peculiar/asn1-schema";

/**
 * ```
 * id-ce-issuingDistributionPoint OBJECT IDENTIFIER ::= { id-ce 28 }
 * ```
 */
export const id_ce_issuingDistributionPoint = `${id_ce}.28`;

/**
 * ```
 * IssuingDistributionPoint ::= SEQUENCE {
 *      distributionPoint          [0] DistributionPointName OPTIONAL,
 *      onlyContainsUserCerts      [1] BOOLEAN DEFAULT FALSE,
 *      onlyContainsCACerts        [2] BOOLEAN DEFAULT FALSE,
 *      onlySomeReasons            [3] ReasonFlags OPTIONAL,
 *      indirectCRL                [4] BOOLEAN DEFAULT FALSE,
 *      onlyContainsAttributeCerts [5] BOOLEAN DEFAULT FALSE }
 *
 *      -- at most one of onlyContainsUserCerts, onlyContainsCACerts,
 *      -- and onlyContainsAttributeCerts may be set to TRUE.
 * ```
 */
export class IssuingDistributionPoint {

  public static readonly ONLY = false;

  @AsnProp({type: DistributionPointName, context: 0, optional: true})
  public distributionPoint?: DistributionPointName;

  @AsnProp({type: AsnPropTypes.Boolean, context: 1, defaultValue: IssuingDistributionPoint.ONLY})
  public onlyContainsUserCerts = IssuingDistributionPoint.ONLY;

  @AsnProp({type: AsnPropTypes.Boolean, context: 2, defaultValue: IssuingDistributionPoint.ONLY})
  public onlyContainsCACerts = IssuingDistributionPoint.ONLY;

  @AsnProp({type: Reason, context: 3, optional: true})
  public onlySomeReasons?: Reason;

  @AsnProp({type: AsnPropTypes.Boolean, context: 4, defaultValue: IssuingDistributionPoint.ONLY})
  public indirectCRL = IssuingDistributionPoint.ONLY;

  @AsnProp({type: AsnPropTypes.Boolean, context: 5, defaultValue: IssuingDistributionPoint.ONLY})
  public onlyContainsAttributeCerts = IssuingDistributionPoint.ONLY;

  public constructor(params: Partial<IssuingDistributionPoint> = {}) {
    Object.assign(this, params);
  }

}
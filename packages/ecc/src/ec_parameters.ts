import { AsnType, AsnTypeTypes, AsnProp, AsnPropTypes } from "@peculiar/asn1-schema";
import { SpecifiedECDomain } from "./rfc3279";

/**
 * ```
 * ECParameters ::= CHOICE {
 *   namedCurve         OBJECT IDENTIFIER
 *   implicitCurve   NULL
 *   specifiedCurve  SpecifiedECDomain
 * }
 *   -- implicitCurve and specifiedCurve MUST NOT be used in PKIX.
 *   -- Details for SpecifiedECDomain can be found in [X9.62].
 *   -- Any future additions to this CHOICE should be coordinated
 *   -- with ANSI X9.
 * ```
 */
@AsnType({ type: AsnTypeTypes.Choice })
export class ECParameters {

  @AsnProp({ type: AsnPropTypes.ObjectIdentifier })
  public namedCurve?: string;

  @AsnProp({ type: AsnPropTypes.Null })
  public implicitCurve?: null;

  @AsnProp({ type: SpecifiedECDomain })
  public specifiedCurve?: SpecifiedECDomain;

  constructor(params: Partial<ECParameters> = {}) {
    Object.assign(this, params);
  }
}
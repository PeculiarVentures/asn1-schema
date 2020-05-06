import { AsnType, AsnTypeTypes, AsnProp } from "@peculiar/asn1-schema";
import { GeneralNames } from "@peculiar/asn1-x509";
import { V2Form } from "./v2_form";

/**
 * ```
 * AttCertIssuer ::= CHOICE {
 *      v1Form   GeneralNames,  -- MUST NOT be used in this
 *                              -- profile
 *      v2Form   [0] V2Form     -- v2 only
 * }
 * ```
 */
@AsnType({ type: AsnTypeTypes.Choice })
export class AttCertIssuer {

  @AsnProp({ type: GeneralNames })
  public v1Form?: GeneralNames;

  @AsnProp({ type: V2Form, context: 0, implicit: true })
  public v2Form?: V2Form;

  constructor(params: Partial<AttCertIssuer> = {}) {
    Object.assign(this, params);
  }
}

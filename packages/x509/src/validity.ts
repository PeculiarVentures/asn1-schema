import { AsnProp } from "@peculiar/asn1-schema";
import { Time } from "./time";

export interface IValidityParams {
  notBefore: Date;
  notAfter: Date;
}
/**
 * ```
 * Validity ::= SEQUENCE {
 *   notBefore      Time,
 *   notAfter       Time  }
 * ```
 */
export class Validity {

  @AsnProp({ type: Time })
  public notBefore = new Time(new Date());

  @AsnProp({ type: Time })
  public notAfter = new Time(new Date());

  constructor(params?: IValidityParams) {
    if (params) {
      this.notBefore = new Time(params.notBefore);
      this.notAfter = new Time(params.notAfter);
    }
  }
}

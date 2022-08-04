import { id_ntQWAC } from "./oids";
import { AsnType, AsnTypeTypes, AsnProp, AsnPropTypes } from '@peculiar/asn1-schema';

export const id_InsuranceValue = `${id_ntQWAC}.8`;

@AsnType({ type: AsnTypeTypes.Sequence })
export class InsuranceValue {

  @AsnProp({ type: AsnPropTypes.PrintableString })
  public location = "";

  @AsnProp({ type: AsnPropTypes.Integer })
  public base = 0;

  @AsnProp({ type: AsnPropTypes.Integer })
  public degree = 0;

  public constructor(params: Partial<InsuranceValue> = {}) {
    Object.assign(this, params);
  }

  public toString(): string {
    return `${this.base} x 10^${this.degree} ${this.location}`;
  }
}
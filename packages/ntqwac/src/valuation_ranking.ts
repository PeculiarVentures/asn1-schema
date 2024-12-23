import { id_ntQWAC } from "./oids";
import { AsnType, AsnTypeTypes, AsnProp, AsnPropTypes } from "@peculiar/asn1-schema";

export const id_ValuationRanking = `${id_ntQWAC}.9`;

@AsnType({ type: AsnTypeTypes.Sequence })
export class ValuationRanking {
  @AsnProp({ type: AsnPropTypes.Integer })
  public stars5 = 0;

  @AsnProp({ type: AsnPropTypes.Integer })
  public stars4 = 0;

  @AsnProp({ type: AsnPropTypes.Integer })
  public stars3 = 0;

  @AsnProp({ type: AsnPropTypes.Integer })
  public stars2 = 0;

  @AsnProp({ type: AsnPropTypes.Integer })
  public stars1 = 0;

  public constructor(params: Partial<ValuationRanking> = {}) {
    Object.assign(this, params);
  }
}

import { AsnType, AsnTypeTypes, AsnProp, BitString } from '@peculiar/asn1-schema';
import { id_ntQWAC } from './oids';

export const id_TypeRelationship = `${id_ntQWAC}.5`;

@AsnType({ type: AsnTypeTypes.Sequence })
export class TypeRelationship {

  @AsnProp({ type: BitString, context: 0 })
  public DNBvsDNO = new BitString(0);

  @AsnProp({ type: BitString, context: 1})
  public DNBvsDNT = new BitString(0);

  @AsnProp({ type: BitString, context: 2 })
  public DNOvsDNT = new BitString(0);

  public constructor(params: Partial<TypeRelationship> = {}) {
    Object.assign(this, params);
  }
}
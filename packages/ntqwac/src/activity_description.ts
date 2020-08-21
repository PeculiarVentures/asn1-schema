import { AsnType, AsnTypeTypes, AsnProp, BitString, AsnPropTypes } from '@peculiar/asn1-schema';
import { GeneralName } from '@peculiar/asn1-x509';
import { id_ntQWAC } from './oids';

export const id_ActivityDescription = `${id_ntQWAC}.6`;

@AsnType({ type: AsnTypeTypes.Sequence })
export class ActivityDescription {

  @AsnProp({ type: GeneralName, context: 0 })
  public codeAuthority = new GeneralName();

  @AsnProp({ type: GeneralName, context: 1})
  public codeId = new GeneralName();

  @AsnProp({ type: AsnPropTypes.Utf8String, context: 2 })
  public shortName = "";

  @AsnProp({ type: AsnPropTypes.Utf8String, context: 3 })
  public shortDescription = "";

  public constructor(params: Partial<ActivityDescription> = {}) {
    Object.assign(this, params);
  }
}
import { AsnType, AsnTypeTypes, AsnProp, AsnPropTypes } from "@peculiar/asn1-schema";
import { GeneralName } from "@peculiar/asn1-x509";
import { id_ntQWAC } from "./oids";

export const id_WebGDPR = `${id_ntQWAC}.7`;

@AsnType({ type: AsnTypeTypes.Sequence })
export class WebGDPR {
  @AsnProp({ type: GeneralName, context: 0 })
  public assessmentAuthority = new GeneralName();

  @AsnProp({ type: GeneralName, context: 1 })
  public assessmentRef = new GeneralName();

  @AsnProp({ type: GeneralName, context: 2 })
  public assessmentLocation = new GeneralName();

  @AsnProp({ type: AsnPropTypes.PrintableString, context: 3 })
  public dataStorageTerritory = "";

  @AsnProp({ type: AsnPropTypes.Utf8String, context: 4 })
  public description = "";

  public constructor(params: Partial<WebGDPR> = {}) {
    Object.assign(this, params);
  }
}

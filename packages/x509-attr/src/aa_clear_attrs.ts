import { AsnProp, AsnPropTypes } from "@peculiar/asn1-schema";
import { GeneralName, Attribute } from "@peculiar/asn1-x509";

/**
 * ```
 * ACClearAttrs ::= SEQUENCE {
 *      acIssuer          GeneralName,
 *      acSerial          INTEGER,
 *      attrs             SEQUENCE OF Attribute
 * }
 * ```
 */
export class ACClearAttrs {

  @AsnProp({ type: GeneralName })
  public acIssuer = new GeneralName();

  @AsnProp({ type: AsnPropTypes.Integer })
  public acSerial = 0;

  @AsnProp({ type: Attribute, repeated: "sequence" })
  public attrs: Attribute[] = [];

  constructor(params: Partial<ACClearAttrs> = {}) {
    Object.assign(this, params);
  }
}

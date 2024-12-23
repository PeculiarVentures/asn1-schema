import {
  AsnProp,
  AsnPropTypes,
  AsnType,
  AsnTypeTypes,
  AsnIntegerArrayBufferConverter,
} from "@peculiar/asn1-schema";
import { id_ce } from "../object_identifiers";

/**
 * ```asn1
 * id-ce-inhibitAnyPolicy OBJECT IDENTIFIER ::=  { id-ce 54 }
 * ```
 */
export const id_ce_inhibitAnyPolicy = `${id_ce}.54`;

/**
 * ```asn1
 * InhibitAnyPolicy ::= SkipCerts
 * ```
 */
@AsnType({ type: AsnTypeTypes.Choice })
export class InhibitAnyPolicy {
  @AsnProp({ type: AsnPropTypes.Integer, converter: AsnIntegerArrayBufferConverter })
  public value: ArrayBuffer;

  constructor(value: ArrayBuffer = new ArrayBuffer(0)) {
    this.value = value;
  }
}

import { AsnArray, AsnType, AsnTypeTypes, AsnProp, AsnPropTypes } from "@peculiar/asn1-schema";
import { PKCS12Attribute } from "./attribute";

/**
 * ```
 * SafeBag ::= SEQUENCE {
 *   bagId         BAG-TYPE.&id ({PKCS12BagSet}),
 *   bagValue      [0] EXPLICIT BAG-TYPE.&Type({PKCS12BagSet}{@bagId}),
 *   bagAttributes SET OF PKCS12Attribute OPTIONAL
 * }
 * ```
 */
export class SafeBag {
  @AsnProp({ type: AsnPropTypes.ObjectIdentifier })
  public bagId = "";

  @AsnProp({ type: AsnPropTypes.Any, context: 0 })
  public bagValue = new ArrayBuffer(0);

  @AsnProp({ type: PKCS12Attribute, repeated: "set", optional: true })
  public bagAttributes?: PKCS12Attribute[];

  constructor(params: Partial<SafeBag> = {}) {
    Object.assign(this, params);
  }
}

/**
 * ```
 * SafeContents ::= SEQUENCE OF SafeBag
 * ```
 */
@AsnType({ type: AsnTypeTypes.Sequence, itemType: SafeBag })
export class SafeContents extends AsnArray<SafeBag> {
  constructor(items?: SafeBag[]) {
    super(items);

    // Set the prototype explicitly.
    Object.setPrototypeOf(this, SafeContents.prototype);
  }
}

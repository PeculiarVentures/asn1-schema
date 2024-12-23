import { AsnProp, AsnPropTypes, AsnArray, AsnType, AsnTypeTypes } from "@peculiar/asn1-schema";

/**
 * ```
 * PKCS12Attribute ::= SEQUENCE {
 *   attrId      ATTRIBUTE.&id ({PKCS12AttrSet}),
 *   attrValues  SET OF ATTRIBUTE.&Type ({PKCS12AttrSet}{@attrId})
 * } -- This type is compatible with the X.500 type 'Attribute'
 * ```
 */
export class PKCS12Attribute {
  @AsnProp({ type: AsnPropTypes.ObjectIdentifier })
  public attrId = "";

  @AsnProp({ type: AsnPropTypes.Any, repeated: "set" })
  public attrValues: ArrayBuffer[] = [];

  constructor(params: Partial<PKCS12Attribute> = {}) {
    Object.assign(params);
  }
}

/**
 * ```
 * PKCS12AttrSet ATTRIBUTE ::= {
 *   friendlyName |
 *   localKeyId,
 *   ... -- Other attributes are allowed
 * }
 * ```
 */
@AsnType({ type: AsnTypeTypes.Sequence, itemType: PKCS12Attribute })
export class PKCS12AttrSet extends AsnArray<PKCS12Attribute> {
  constructor(items?: PKCS12Attribute[]) {
    super(items);

    // Set the prototype explicitly.
    Object.setPrototypeOf(this, PKCS12AttrSet.prototype);
  }
}

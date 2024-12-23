import {
  AsnType,
  AsnTypeTypes,
  AsnProp,
  AsnPropTypes,
  OctetString,
  AsnIntegerArrayBufferConverter,
} from "@peculiar/asn1-schema";

/**
 * ```asn1
 *  FieldID ::= SEQUENCE {
 *    fieldType   OBJECT IDENTIFIER,
 *    parameters  ANY DEFINED BY fieldType }
 * ```
 */
@AsnType({ type: AsnTypeTypes.Sequence })
export class FieldID {
  @AsnProp({ type: AsnPropTypes.ObjectIdentifier })
  public fieldType!: string;

  @AsnProp({ type: AsnPropTypes.Any })
  public parameters!: ArrayBuffer;

  constructor(params: Partial<FieldID> = {}) {
    Object.assign(this, params);
  }
}

/**
 * ```asn1
 *  ECPoint ::= OCTET STRING
 * ```
 */
export class ECPoint extends OctetString {}

/**
 * ```asn1
 *  FieldElement ::= OCTET STRING
 * ```
 */
export class FieldElement extends OctetString {}

/**
 * ```asn1
 *  Curve ::= SEQUENCE {
 *    a         FieldElement,
 *    b         FieldElement,
 *    seed      BIT STRING OPTIONAL }
 * ```
 */
@AsnType({ type: AsnTypeTypes.Sequence })
export class Curve {
  @AsnProp({ type: AsnPropTypes.OctetString })
  public a!: ArrayBuffer;

  @AsnProp({ type: AsnPropTypes.OctetString })
  public b!: ArrayBuffer;

  @AsnProp({ type: AsnPropTypes.BitString, optional: true })
  public seed?: ArrayBuffer;

  constructor(params: Partial<Curve> = {}) {
    Object.assign(this, params);
  }
}

/**
 * ```asn1
 *  ECPVer ::= INTEGER {ecpVer1(1)}
 * ```
 */
export enum ECPVer {
  ecpVer1 = 1,
}

/**
 * ```asn1
 * SpecifiedECDomain ::= SEQUENCE {
 *   version   ECPVer,          -- version is always 1
 *   fieldID   FieldID,         -- identifies the finite field over
 *                              -- which the curve is defined
 *   curve     Curve,           -- coefficients a and b of the
 *                              -- elliptic curve
 *   base      ECPoint,         -- specifies the base point P
 *                              -- on the elliptic curve
 *   order     INTEGER,         -- the order n of the base point
 *   cofactor  INTEGER OPTIONAL -- The integer h = #E(Fq)/n
 *   }
 * ```
 */
@AsnType({ type: AsnTypeTypes.Sequence })
export class SpecifiedECDomain {
  @AsnProp({ type: AsnPropTypes.Integer })
  public version: ECPVer = ECPVer.ecpVer1;

  @AsnProp({ type: FieldID })
  public fieldID!: FieldID;

  @AsnProp({ type: Curve })
  public curve!: Curve;

  @AsnProp({ type: ECPoint })
  public base!: ECPoint;

  @AsnProp({ type: AsnPropTypes.Integer, converter: AsnIntegerArrayBufferConverter })
  public order!: ArrayBuffer;

  @AsnProp({ type: AsnPropTypes.Integer, optional: true })
  public cofactor?: ArrayBuffer;

  constructor(params: Partial<SpecifiedECDomain> = {}) {
    Object.assign(this, params);
  }
}

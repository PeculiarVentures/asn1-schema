import { AsnProp, AsnPropTypes, AsnIntegerArrayBufferConverter } from "@peculiar/asn1-schema";
import { Name } from "@peculiar/asn1-x509";

/**
 * ```asn
 * IssuerAndSerialNumber ::= SEQUENCE {
 *   issuer Name,
 *   serialNumber CertificateSerialNumber }
 * ```
 */
export class IssuerAndSerialNumber {
  @AsnProp({ type: Name })
  public issuer = new Name;

  @AsnProp({ type: AsnPropTypes.Integer, converter: AsnIntegerArrayBufferConverter })
  public serialNumber = new ArrayBuffer(0);

  constructor(params: Partial<IssuerAndSerialNumber> = {}) {
    Object.assign(this, params);
  }
}

/**
 * ```asn
 * CertificateSerialNumber ::= INTEGER
 * ```
 */
export type CertificateSerialNumber = ArrayBuffer;

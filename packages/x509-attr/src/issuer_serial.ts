import { AsnProp, AsnPropTypes, AsnIntegerArrayBufferConverter } from "@peculiar/asn1-schema";
import { GeneralNames, CertificateSerialNumber, UniqueIdentifier } from "@peculiar/asn1-x509";

/**
 * ```
 * IssuerSerial  ::=  SEQUENCE {
 *      issuer         GeneralNames,
 *      serial         CertificateSerialNumber,
 *      issuerUID      UniqueIdentifier OPTIONAL
 * }
 * ```
 */
export class IssuerSerial {

  @AsnProp({ type: GeneralNames })
  public issuer = new GeneralNames();

  @AsnProp({ type: AsnPropTypes.Integer, converter: AsnIntegerArrayBufferConverter })
  public serial: CertificateSerialNumber = new ArrayBuffer(0);

  @AsnProp({ type: AsnPropTypes.BitString, optional: true })
  public issuerUID: UniqueIdentifier = new ArrayBuffer(0);

  constructor(params: Partial<IssuerSerial> = {}) {
    Object.assign(this, params);
  }
}
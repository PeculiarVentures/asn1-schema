import { AlgorithmIdentifier } from "@peculiar/asn1-x509";
import { AsnProp, AsnPropTypes, AsnIntegerArrayBufferConverter, OctetString } from "@peculiar/asn1-schema";

/**
 * ```
 * CertID          ::=     SEQUENCE {
 *   hashAlgorithm       AlgorithmIdentifier,
 *   issuerNameHash      OCTET STRING, -- Hash of issuer's DN
 *   issuerKeyHash       OCTET STRING, -- Hash of issuer's public key
 *   serialNumber        CertificateSerialNumber }
 * ```
 */
export class CertID {

  @AsnProp({ type: AlgorithmIdentifier })
  public hashAlgorithm = new AlgorithmIdentifier();

  @AsnProp({ type: OctetString })
  public issuerNameHash = new OctetString();

  @AsnProp({ type: OctetString })
  public issuerKeyHash = new OctetString();

  @AsnProp({ type: AsnPropTypes.Integer, converter: AsnIntegerArrayBufferConverter })
  public serialNumber = new ArrayBuffer(0);

  constructor(params: Partial<CertID> = {}) {
    Object.assign(this, params);
  }
}
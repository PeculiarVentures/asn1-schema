import { AsnProp, AsnPropTypes, AsnIntegerArrayBufferConverter } from "@peculiar/asn1-schema";
import {
  AlgorithmIdentifier,
  Attribute,
  UniqueIdentifier,
  Extensions,
  CertificateSerialNumber,
} from "@peculiar/asn1-x509";
import { Holder } from "./holder";
import { AttCertIssuer } from "./attr_cert_issuer";
import { AttCertValidityPeriod } from "./attr_cert_validity_period";

/**
 * ```asn1
 * AttCertVersion ::= INTEGER { v2(1) }
 * ```
 */
export enum AttCertVersion {
  v2 = 1,
}

/**
 * ```asn1
 * AttributeCertificateInfo ::= SEQUENCE {
 *   version        AttCertVersion  -- version is v2,
 *   holder         Holder,
 *   issuer         AttCertIssuer,
 *   signature      AlgorithmIdentifier,
 *   serialNumber   CertificateSerialNumber,
 *   attrCertValidityPeriod   AttCertValidityPeriod,
 *   attributes     SEQUENCE OF Attribute,
 *   issuerUniqueID UniqueIdentifier OPTIONAL,
 *   extensions     Extensions     OPTIONAL
 * }
 * ```
 */
export class AttributeCertificateInfo {
  @AsnProp({ type: AsnPropTypes.Integer })
  public version = AttCertVersion.v2;

  @AsnProp({ type: Holder })
  public holder = new Holder();

  @AsnProp({ type: AttCertIssuer })
  public issuer = new AttCertIssuer();

  @AsnProp({ type: AlgorithmIdentifier })
  public signature = new AlgorithmIdentifier();

  @AsnProp({ type: AsnPropTypes.Integer, converter: AsnIntegerArrayBufferConverter })
  public serialNumber: CertificateSerialNumber = new ArrayBuffer(0);

  @AsnProp({ type: AttCertValidityPeriod })
  public attrCertValidityPeriod = new AttCertValidityPeriod();

  @AsnProp({ type: Attribute, repeated: "sequence" })
  public attributes: Attribute[] = [];

  @AsnProp({ type: AsnPropTypes.BitString, optional: true })
  public issuerUniqueID?: UniqueIdentifier;

  @AsnProp({ type: Extensions, optional: true })
  public extensions?: Extensions;

  constructor(params: Partial<AttributeCertificateInfo> = {}) {
    Object.assign(this, params);
  }
}

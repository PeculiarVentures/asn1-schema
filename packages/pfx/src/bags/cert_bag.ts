import { AsnProp, AsnPropTypes } from "@peculiar/asn1-schema";
import { id_pkcs_9 } from "./types";

/**
 * ```asn1
 * CertBag ::= SEQUENCE {
 *   certId    BAG-TYPE.&id   ({CertTypes}),
 *   certValue [0] EXPLICIT BAG-TYPE.&Type ({CertTypes}{@certId})
 * }
 * ```
 */
export class CertBag {
  @AsnProp({ type: AsnPropTypes.ObjectIdentifier })
  public certId = "";

  @AsnProp({ type: AsnPropTypes.Any, context: 0 })
  public certValue = new ArrayBuffer(0);

  constructor(params: Partial<CertBag> = {}) {
    Object.assign(this, params);
  }
}

/**
 * ```asn1
 * certTypes OBJECT IDENTIFIER ::= {pkcs-9 22}
 * ```
 */
export const id_certTypes = `${id_pkcs_9}.22`;

/**
 * ```asn1
 * x509Certificate BAG-TYPE ::=
 *   {OCTET STRING IDENTIFIED BY {certTypes 1}}
 *   -- DER-encoded X.509 certificate stored in OCTET STRING
 * ```
 */
export const id_x509Certificate = `${id_certTypes}.1`;

/**
 * ```asn1
 * sdsiCertificate BAG-TYPE ::=
 *   {IA5String IDENTIFIED BY {certTypes 2}}
 *   -- Base64-encoded SDSI certificate stored in IA5String
 * ```
 */
export const id_sdsiCertificate = `${id_certTypes}.2`;

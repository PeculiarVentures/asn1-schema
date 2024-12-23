import { AsnProp, AsnPropTypes } from "@peculiar/asn1-schema";
import { id_pkcs_9 } from "./types";

/**
 * ```asn1
 * CRLBag ::= SEQUENCE {
 *   crlId     BAG-TYPE.&id ({CRLTypes}),
 *   crltValue [0] EXPLICIT BAG-TYPE.&Type ({CRLTypes}{@crlId})
 * }
 * ```
 */
export class CRLBag {
  @AsnProp({ type: AsnPropTypes.ObjectIdentifier })
  public crlId = "";

  @AsnProp({ type: AsnPropTypes.Any, context: 0 })
  public crltValue = new ArrayBuffer(0);

  constructor(params: Partial<CRLBag> = {}) {
    Object.assign(this, params);
  }
}

/**
 * ```asn1
 * crlTypes OBJECT IDENTIFIER ::= {pkcs-9 23}
 * ```
 */
export const id_crlTypes = `${id_pkcs_9}.23`;

/**
 * ```asn1
 * x509CRL BAG-TYPE ::=
 *   {OCTET STRING IDENTIFIED BY {crlTypes 1}}
 *   -- DER-encoded X.509 CRL stored in OCTET STRING
 * ```
 */
export const id_x509CRL = `${id_crlTypes}.1`;

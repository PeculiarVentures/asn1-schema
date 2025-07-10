import { AsnType, AsnTypeTypes, AsnProp } from "@peculiar/asn1-schema";
import { Certificate } from "@peculiar/asn1-x509";
import { IssuerAndSerialNumber } from "@peculiar/asn1-cms";

/**
 * ```asn1
 * OID for id-at-statementOfPossession (1.3.6.1.4.1.22112.2.1)
 * ```
 */
export const id_at_statementOfPossession = "1.3.6.1.4.1.22112.2.1";

/**
 * ```asn1
 * PrivateKeyPossessionStatement ::= SEQUENCE {
 *   signer  IssuerAndSerialNumber,
 *   cert    Certificate OPTIONAL
 * }
 * ```
 */
@AsnType({ type: AsnTypeTypes.Sequence })
export class PrivateKeyPossessionStatement {
  @AsnProp({ type: IssuerAndSerialNumber })
  public signer!: IssuerAndSerialNumber;

  @AsnProp({ type: Certificate, optional: true })
  public cert?: Certificate;

  constructor(params: Partial<PrivateKeyPossessionStatement> = {}) {
    Object.assign(this, params);
  }
}

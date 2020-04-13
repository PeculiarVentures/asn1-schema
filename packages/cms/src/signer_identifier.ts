import { AsnProp, AsnType, AsnTypeTypes } from "@peculiar/asn1-schema";
import { IssuerAndSerialNumber } from "./issuer_and_serial_number";
import { SubjectKeyIdentifier } from "@peculiar/asn1-x509";

/**
 * ```
 * SignerIdentifier ::= CHOICE {
 *   issuerAndSerialNumber IssuerAndSerialNumber,
 *   subjectKeyIdentifier [0] SubjectKeyIdentifier }
 * ```
 */
@AsnType({ type: AsnTypeTypes.Choice })
export class SignerIdentifier {

  @AsnProp({ type: IssuerAndSerialNumber })
  public issuerAndSerialNumber = new IssuerAndSerialNumber();

  @AsnProp({ type: SubjectKeyIdentifier, context: 0 })
  public subjectKeyIdentifier = new SubjectKeyIdentifier();

  constructor(params: Partial<SignerIdentifier> = {}) {
    Object.assign(this, params);
  }
}
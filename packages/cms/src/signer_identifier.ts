import { AsnProp, AsnType, AsnTypeTypes } from "@peculiar/asn1-schema";
import { SubjectKeyIdentifier } from "@peculiar/asn1-x509";
import { IssuerAndSerialNumber } from "./issuer_and_serial_number";

/**
 * ```asn
 * SignerIdentifier ::= CHOICE {
 *   issuerAndSerialNumber IssuerAndSerialNumber,
 *   subjectKeyIdentifier [0] SubjectKeyIdentifier }
 * ```
 */
@AsnType({ type: AsnTypeTypes.Choice })
export class SignerIdentifier {
  // * Declare subjectKeyIdentifier before issuerAndSerialNumber, because issuerAndSerialNumber is any in schema declaration
  @AsnProp({ type: SubjectKeyIdentifier, context: 0, implicit: true })
  public subjectKeyIdentifier?: SubjectKeyIdentifier;

  @AsnProp({ type: IssuerAndSerialNumber })
  public issuerAndSerialNumber?: IssuerAndSerialNumber;

  constructor(params: Partial<SignerIdentifier> = {}) {
    Object.assign(this, params);
  }
}

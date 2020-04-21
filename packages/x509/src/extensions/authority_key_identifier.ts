import { AsnProp, AsnPropTypes, AsnIntegerArrayBufferConverter, OctetString } from "@peculiar/asn1-schema";
import { GeneralName } from "../general_name";
import { id_ce } from "../object_identifiers";
import { CertificateSerialNumber } from "../types";

/**
 * ```
 * id-ce-authorityKeyIdentifier OBJECT IDENTIFIER ::=  { id-ce 35 }
 * ```
 */
export const id_ce_authorityKeyIdentifier = `${id_ce}.35`;

/**
 * ```
 * KeyIdentifier ::= OCTET STRING
 * ```
 */
export class KeyIdentifier extends OctetString { }

/**
 * ```
 * AuthorityKeyIdentifier ::= SEQUENCE {
 *   keyIdentifier             [0] KeyIdentifier           OPTIONAL,
 *   authorityCertIssuer       [1] GeneralNames            OPTIONAL,
 *   authorityCertSerialNumber [2] CertificateSerialNumber OPTIONAL  }
 * ```
 */

export class AuthorityKeyIdentifier {

  @AsnProp({ type: KeyIdentifier, context: 0, optional: true, implicit: true })
  public keyIdentifier?: KeyIdentifier;

  @AsnProp({ type: GeneralName, context: 1, optional: true, implicit: true, repeated: "sequence" })
  public authorityCertIssuer?: GeneralName[];

  @AsnProp({
    type: AsnPropTypes.Integer,
    context: 2,
    optional: true,
    implicit: true,
    converter: AsnIntegerArrayBufferConverter,
  })
  public authorityCertSerialNumber?: CertificateSerialNumber;

  constructor(params: Partial<AuthorityKeyIdentifier> = {}) {
    if (params) {
      Object.assign(this, params);
    }
  }

}

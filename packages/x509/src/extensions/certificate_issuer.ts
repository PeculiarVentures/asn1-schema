import { AsnType, AsnTypeTypes } from "@peculiar/asn1-schema";
import { GeneralNames } from "../general_names";
import { id_ce } from "../object_identifiers";
import { GeneralName } from '../general_name';

/**
 * ```
 * id-ce-certificateIssuer   OBJECT IDENTIFIER ::= { id-ce 29 }
 * ```
 */
export const id_ce_certificateIssuer = `${id_ce}.29`;

/**
 * ```
 * CertificateIssuer ::=     GeneralNames
 * ```
 */
@AsnType({ type: AsnTypeTypes.Sequence })
export class CertificateIssuer extends GeneralNames {

  constructor(items?: GeneralName[]) {
    super(items);

    // Set the prototype explicitly.
    Object.setPrototypeOf(this, CertificateIssuer.prototype);
  }

}

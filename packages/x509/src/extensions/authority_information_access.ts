import { AsnProp, AsnPropTypes, AsnArray, AsnType, AsnTypeTypes } from "@peculiar/asn1-schema";
import { GeneralName } from "../general_name";
import { id_pe } from "../object_identifiers";

/***
 * ```asn1
 * id-pe-authorityInfoAccess OBJECT IDENTIFIER ::= { id-pe 1 }
 * ```
 */
export const id_pe_authorityInfoAccess = `${id_pe}.1`;

/**
 * ```asn1
 * AccessDescription  ::=  SEQUENCE {
 *   accessMethod          OBJECT IDENTIFIER,
 *   accessLocation        GeneralName  }
 * ```
 */
export class AccessDescription {
  @AsnProp({ type: AsnPropTypes.ObjectIdentifier })
  public accessMethod = "";

  @AsnProp({ type: GeneralName })
  public accessLocation = new GeneralName();

  constructor(params: Partial<AccessDescription> = {}) {
    Object.assign(this, params);
  }
}

/**
 * ```asn1
 * AuthorityInfoAccessSyntax  ::=
 *   SEQUENCE SIZE (1..MAX) OF AccessDescription
 * ```
 */
@AsnType({ type: AsnTypeTypes.Sequence, itemType: AccessDescription })
export class AuthorityInfoAccessSyntax extends AsnArray<AccessDescription> {
  constructor(items?: AccessDescription[]) {
    super(items);

    // Set the prototype explicitly.
    Object.setPrototypeOf(this, AuthorityInfoAccessSyntax.prototype);
  }
}

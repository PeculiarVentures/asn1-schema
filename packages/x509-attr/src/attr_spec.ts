import { AsnType, AsnTypeTypes, AsnPropTypes, AsnArray } from "@peculiar/asn1-schema";

/**
 * ```
 * AttrSpec ::= SEQUENCE OF OBJECT IDENTIFIER
 * ```
 */
@AsnType({ type: AsnTypeTypes.Sequence, itemType: AsnPropTypes.ObjectIdentifier })
export class AttrSpec extends AsnArray<string> { }

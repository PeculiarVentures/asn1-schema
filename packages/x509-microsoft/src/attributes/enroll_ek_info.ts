import { AsnType, AsnTypeTypes, AsnPropTypes, AsnArray } from "@peculiar/asn1-schema";

export const id_enrollEKInfo = "1.3.6.1.4.1.311.21.23";

/**
 * ```
 * EndorsementKeyInfo ::= SEQUENCE SIZE (2..5) OF ANY
 * ```
 */
@AsnType({ type: AsnTypeTypes.Sequence, itemType: AsnPropTypes.Any })
export class EndorsementKeyInfo extends AsnArray<ArrayBuffer> { }

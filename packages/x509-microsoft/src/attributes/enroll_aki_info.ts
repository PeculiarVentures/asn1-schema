import { AsnType, AsnTypeTypes, AsnPropTypes, AsnArray } from "@peculiar/asn1-schema";

export const id_enrollAKIInfo = "1.3.6.1.4.1.311.21.39";

/**
 * ```
 * AttestationIdentityKeyInfo ::= SEQUENCE SIZE (1..2) OF ANY
 * ```
 */
@AsnType({ type: AsnTypeTypes.Sequence, itemType: AsnPropTypes.Any })
export class AttestationIdentityKeyInfo extends AsnArray<ArrayBuffer> { }

import { AsnProp, AsnPropTypes, AsnArray, AsnType, AsnTypeTypes } from "@peculiar/asn1-schema";

// re-ocsp-response EXTENSION ::= { SYNTAX AcceptableResponses IDENTIFIED
//   BY id-pkix-ocsp-response }

/**
 * ```
 * AcceptableResponses ::= SEQUENCE OF RESPONSE.&id({ResponseSet})
 * ```
 */
@AsnType({ type: AsnTypeTypes.Sequence, itemType: AsnPropTypes.ObjectIdentifier })
export class AcceptableResponses extends AsnArray<AsnPropTypes.ObjectIdentifier> { }

import { AsnProp, AsnPropTypes, AsnArray, AsnType, AsnTypeTypes } from "@peculiar/asn1-schema";

// re-ocsp-response EXTENSION ::= { SYNTAX AcceptableResponses IDENTIFIED
//   BY id-pkix-ocsp-response }

/**
 * ```
 * AcceptableResponses ::= SEQUENCE OF RESPONSE.&id({ResponseSet})
 * ```
 */
@AsnType({ type: AsnTypeTypes.Sequence, itemType: AsnPropTypes.ObjectIdentifier })
export class AcceptableResponses extends AsnArray<string> {

  constructor(items?: string[]) {
    super(items);

    // Set the prototype explicitly.
    Object.setPrototypeOf(this, AcceptableResponses.prototype);
  }

}

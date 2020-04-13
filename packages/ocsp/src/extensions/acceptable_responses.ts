import { AsnProp, AsnPropTypes } from "@peculiar/asn1-schema";

// re-ocsp-response EXTENSION ::= { SYNTAX AcceptableResponses IDENTIFIED
//   BY id-pkix-ocsp-response }

/**
 * ```
 * AcceptableResponses ::= SEQUENCE OF RESPONSE.&id({ResponseSet})
 * ```
 */
export class AcceptableResponses {

  @AsnProp({ type: AsnPropTypes.ObjectIdentifier, repeated: true })
  public items: string[];

  constructor(items: string[] = []) {
    this.items = items;
  }
}
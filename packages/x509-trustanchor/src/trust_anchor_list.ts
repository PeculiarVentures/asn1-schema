import { AsnArray, AsnType, AsnTypeTypes } from "@peculiar/asn1-schema";
import { TrustAnchorChoice } from "./trust_anchor_choice";

/**
 * ```
 * id-ct-trustAnchorList      OBJECT IDENTIFIER ::= { iso(1)
 *   member-body(2) us(840) rsadsi(113549) pkcs(1) pkcs9(9)
 *   id-smime(16) id-ct(1) 34 }
 * ```
 */
export const id_ct_trustAnchorList = "1.2.840.113549.1.9.16.1.34";

/**
 * ```
 * TrustAnchorList ::= SEQUENCE SIZE (1..MAX) OF TrustAnchorChoice
 * ```
 */
@AsnType({ type: AsnTypeTypes.Sequence, itemType: TrustAnchorChoice })
export class TrustAnchorList extends AsnArray<TrustAnchorChoice> {
  constructor(items?: TrustAnchorChoice[]) {
    super(items);

    // Set the prototype explicitly.
    Object.setPrototypeOf(this, TrustAnchorList.prototype);
  }
}

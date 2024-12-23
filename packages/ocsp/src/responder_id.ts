import { AsnProp, AsnType, AsnTypeTypes, OctetString } from "@peculiar/asn1-schema";
import { Name } from "@peculiar/asn1-x509";

/**
 * ```
 * KeyHash ::= OCTET STRING -- SHA-1 hash of responder's public key
 *   -- (excluding the tag and length fields)
 * ```
 */
export class KeyHash extends OctetString {}

/**
 * ```
 * ResponderID ::= CHOICE {
 *   byName   [1] Name,
 *   byKey    [2] KeyHash }
 * ```
 */
@AsnType({ type: AsnTypeTypes.Choice })
export class ResponderID {
  @AsnProp({ type: Name, context: 1 })
  public byName?: Name;

  /**
   * SHA-1 hash of responder's public key
   */
  @AsnProp({ type: KeyHash, context: 2 })
  public byKey?: KeyHash;

  constructor(params: Partial<ResponderID> = {}) {
    Object.assign(this, params);
  }
}

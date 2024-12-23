import { AsnProp, OctetString } from "@peculiar/asn1-schema";
import { AlgorithmIdentifier } from "@peculiar/asn1-x509";

/**
 * ```
 * MessageImprint ::= SEQUENCE  {
 *  hashAlgorithm                AlgorithmIdentifier,
 *  hashedMessage                OCTET STRING  }
 * ```
 */

export class MessageImprint {
  @AsnProp({ type: AlgorithmIdentifier })
  public hashAlgorithm = new AlgorithmIdentifier();

  @AsnProp({ type: OctetString })
  public hashedMessage = new OctetString();

  constructor(params: Partial<MessageImprint> = {}) {
    Object.assign(this, params);
  }
}

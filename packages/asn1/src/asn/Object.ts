import { BERObject, BERIdentifierOctets } from "../ber";

export class ASNObject extends BERObject {

  public static readonly DEFAULT_BER_IDENTIFIER = new Uint8Array([0x00]);
  public items: ASNObject[] | null = null;

  constructor() {
    super();

    this.identifier = BERIdentifierOctets.fromBER((this.constructor as typeof ASNObject).DEFAULT_BER_IDENTIFIER);
  }

}

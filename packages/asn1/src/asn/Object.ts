import { BERObject, BERIdentifierOctets } from "../ber";
import { universal } from "./Types";

export class AsnObject extends BERObject {

  public static readonly DEFAULT_BER_IDENTIFIER = new Uint8Array([0x00]);

  public items: AsnObject[] | null = null;

  constructor() {
    super();

    this.identifier = BERIdentifierOctets.fromBER((this.constructor as typeof AsnObject).DEFAULT_BER_IDENTIFIER);
  }

}

import { AsnObject } from "./Object";
import { universal } from "./Types";

@universal(16)
export class AsnSequence extends AsnObject {

  public static override readonly DEFAULT_BER_IDENTIFIER = new Uint8Array([0x48]);

  constructor(items?: AsnObject[]) {
    super();

    if (items) {
      this.items = items;
    }
  }

}

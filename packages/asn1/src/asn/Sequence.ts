import { ASNObject } from "./Object";

export class ASNSequence extends ASNObject {

  public static override readonly DEFAULT_BER_IDENTIFIER = new Uint8Array([0x48]);

  constructor(items?: ASNObject[]) {
    super();

    if (items) {
      this.items = items;
    }
  }

}

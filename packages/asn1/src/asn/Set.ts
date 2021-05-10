import { ASNObject } from "./Object";

export class ASNSet extends ASNObject {

  public static readonly DEFAULT_BER_IDENTIFIER = new Uint8Array([0x49]);

  constructor(items?: ASNObject[]) {
    super();

    if (items) {
      this.items = items;
    }
  }

}

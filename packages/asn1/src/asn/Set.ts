import { AsnObject } from "./Object";

export class AsnSet extends AsnObject {

  public static override readonly DEFAULT_BER_IDENTIFIER = new Uint8Array([0x49]);

  constructor(items?: AsnObject[]) {
    super();

    if (items) {
      this.items = items;
    }
  }

}

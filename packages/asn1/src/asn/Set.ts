import { AsnObject } from "./Object";
import { universal } from "./Types";

@universal(17)
export class AsnSet extends AsnObject {

  public static override readonly DEFAULT_BER_IDENTIFIER = new Uint8Array([0x49]);

  constructor(items?: AsnObject[]) {
    super();

    if (items) {
      this.items = items;
    }
  }

}

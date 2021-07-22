import { Convert } from "pvtsutils";
import { ASNObject } from "./Object";

export class ASNUniversalString extends ASNObject {

  public static override readonly DEFAULT_BER_IDENTIFIER = new Uint8Array([0x1c]);

  public get value(): string {
    const view = this.content.view.slice();
    for (let i = 0; i < view.length; i += 4) {
      view[i] = view[i + 3];
      view[i + 1] = view[i + 2];
      view[i + 2] = 0x00;
      view[i + 3] = 0x00;
    }

    return Convert.ToBinary(view);
  }
}

import { Convert } from "pvtsutils";
import { ASNObject } from "./Object";


export class ASNBmpString extends ASNObject {

  public static override readonly DEFAULT_BER_IDENTIFIER = new Uint8Array([0x1e]);

  public get value(): string {
    const view = this.content.view.slice(0);

    for (let i = 0; i < view.length; i += 2) {
      const temp = view[i];

      view[i] = view[i + 1];
      view[i + 1] = temp;
    }

    return Convert.ToBinary(view);
  }

}

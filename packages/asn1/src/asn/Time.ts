import { ASNObject } from "./Object";

export class ASNTime extends ASNObject {
  public static override readonly DEFAULT_BER_IDENTIFIER = new Uint8Array([0x0E]);
}

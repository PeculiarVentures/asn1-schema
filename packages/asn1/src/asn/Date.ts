import { ASNObject } from "./Object";

export class ASNDate extends ASNObject {

  public static readonly DEFAULT_BER_IDENTIFIER = new Uint8Array([0x1f, 0x1f]);

}

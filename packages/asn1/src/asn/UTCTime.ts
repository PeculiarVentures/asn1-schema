import { ASNObject } from "./Object";

export class ASNUTCTime extends ASNObject {

  public static override readonly DEFAULT_BER_IDENTIFIER = new Uint8Array([0x17]);

}

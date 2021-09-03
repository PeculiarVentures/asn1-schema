import { AsnObject } from "./Object";

export class AsnDuration extends AsnObject {

  public static override readonly DEFAULT_BER_IDENTIFIER = new Uint8Array([0x1f, 0x22]);

}

import { AsnObject } from "./Object";

export class AsnTime extends AsnObject {
  public static override readonly DEFAULT_BER_IDENTIFIER = new Uint8Array([0x0E]);
}

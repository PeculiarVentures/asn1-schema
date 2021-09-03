import { AsnObject } from "./Object";
import { universal } from "./Types";

@universal(14)
export class AsnTime extends AsnObject {
  public static override readonly DEFAULT_BER_IDENTIFIER = new Uint8Array([0x0E]);
}

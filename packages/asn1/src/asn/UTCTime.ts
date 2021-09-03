import { AsnObject } from "./Object";
import { universal } from "./Types";

@universal(23)
export class AsnUTCTime extends AsnObject {

  public static override readonly DEFAULT_BER_IDENTIFIER = new Uint8Array([0x17]);

}

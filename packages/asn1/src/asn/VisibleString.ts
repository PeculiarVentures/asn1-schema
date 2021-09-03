import { AsnString } from "./String";
import { universal } from "./Types";

@universal(26)
export class AsnVisibleString extends AsnString {

  public static override readonly DEFAULT_BER_IDENTIFIER = new Uint8Array([0x1a]);

}

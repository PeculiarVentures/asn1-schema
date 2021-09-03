import { AsnString } from "./String";
import { universal } from "./Types";

@universal(27)
export class AsnGeneralString extends AsnString {

  public static override readonly DEFAULT_BER_IDENTIFIER = new Uint8Array([0x1b]);

}

import { AsnString } from "./String";
import { universal } from "./Types";

@universal(18)
export class AsnNumericString extends AsnString {

  public static override readonly DEFAULT_BER_IDENTIFIER = new Uint8Array([0x12]);

}

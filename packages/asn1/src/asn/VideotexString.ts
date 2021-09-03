import { AsnString } from "./String";
import { universal } from "./Types";

@universal(21)
export class AsnVideotexString extends AsnString {

  public static override readonly DEFAULT_BER_IDENTIFIER = new Uint8Array([0x15]);

}

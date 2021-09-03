import { AsnString } from "./String";
import { universal } from "./Types";

@universal(20)
export class AsnTeletexString extends AsnString {

  public static override readonly DEFAULT_BER_IDENTIFIER = new Uint8Array([0x14]);

}

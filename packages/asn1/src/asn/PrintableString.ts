import { AsnString } from "./String";
import { universal } from "./Types";

@universal(19)
export class AsnPrintableString extends AsnString {

  public static override readonly DEFAULT_BER_IDENTIFIER = new Uint8Array([0x13]);

}

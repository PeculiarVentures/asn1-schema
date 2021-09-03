import { AsnString } from "./String";
import { universal } from "./Types";

@universal(25)
export class AsnGraphicString extends AsnString {

  public static override readonly DEFAULT_BER_IDENTIFIER = new Uint8Array([0x19]);

}

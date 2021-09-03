import { AsnString } from "./String";
import { universal } from "./Types";

@universal(22)
export class AsnIA5String extends AsnString {

  public static override readonly DEFAULT_BER_IDENTIFIER = new Uint8Array([0x16]);

}

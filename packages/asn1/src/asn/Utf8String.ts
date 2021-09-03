import { Convert, TextEncoding } from "pvtsutils";
import { AsnString } from "./String";
import { universal } from "./Types";

@universal(12)
export class AsnUtf8String extends AsnString {

  public static override readonly DEFAULT_BER_IDENTIFIER = new Uint8Array([0x0C]);
  public static override readonly ENCODING: TextEncoding = "utf8";

}

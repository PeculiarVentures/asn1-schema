import { Convert, TextEncoding } from "pvtsutils";
import { AsnString } from "./String";
import { universal } from "./Types";

@universal(12)
export class AsnUtf8String extends AsnString {

  public static override readonly BER_IDENTIFIER = new Uint8Array([0x0C]);
  public static override readonly ENCODING: TextEncoding = "utf8";
  public static readonly NAME = "UTF8String";

  public readonly name: typeof AsnUtf8String.NAME = AsnUtf8String.NAME;

}

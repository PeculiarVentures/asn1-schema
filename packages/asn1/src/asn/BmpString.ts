import { TextEncoding } from "pvtsutils";
import { AsnString } from "./String";
import { universal } from "./Types";

@universal(30)
export class AsnBmpString extends AsnString {

  public static override readonly BER_IDENTIFIER = new Uint8Array([0x1e]);
  public static override readonly ENCODING: TextEncoding = "utf16be";
  public static readonly NAME = "BMPString";

  public readonly name: typeof AsnBmpString.NAME = AsnBmpString.NAME;

}

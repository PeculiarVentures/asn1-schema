import { Convert, TextEncoding } from "pvtsutils";
import { AsnString } from "./String";

export class AsnBmpString extends AsnString {

  public static override readonly DEFAULT_BER_IDENTIFIER = new Uint8Array([0x1e]);
  public static override readonly ENCODING: TextEncoding = "utf16be";

}

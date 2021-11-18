import { AsnString } from "./String";
import { universal } from "./Types";

@universal(26)
export class AsnVisibleString extends AsnString {

  public static override readonly BER_IDENTIFIER = new Uint8Array([0x1a]);
  public static readonly NAME = "VisibleString";

  public readonly name: typeof AsnVisibleString.NAME = AsnVisibleString.NAME;

}

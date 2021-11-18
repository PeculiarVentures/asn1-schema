import { AsnString } from "./String";
import { universal } from "./Types";

@universal(27)
export class AsnGeneralString extends AsnString {

  public static override readonly BER_IDENTIFIER = new Uint8Array([0x1b]);
  public static readonly NAME = "GeneralString";

  public readonly name: typeof AsnGeneralString.NAME = AsnGeneralString.NAME;

}

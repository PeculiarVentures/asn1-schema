import { AsnString } from "./String";
import { universal } from "./Types";

@universal(18)
export class AsnNumericString extends AsnString {

  public static override readonly BER_IDENTIFIER = new Uint8Array([0x12]);
  public static readonly NAME = "NumericString";

  public readonly name: typeof AsnNumericString.NAME = AsnNumericString.NAME;

}

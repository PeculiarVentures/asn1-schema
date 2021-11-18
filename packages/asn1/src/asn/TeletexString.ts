import { AsnString } from "./String";
import { universal } from "./Types";

@universal(20)
export class AsnTeletexString extends AsnString {

  public static override readonly BER_IDENTIFIER = new Uint8Array([0x14]);
  public static readonly NAME = "TeletexString";

  public readonly name: typeof AsnTeletexString.NAME = AsnTeletexString.NAME;

}

import { AsnString } from "./String";
import { universal } from "./Types";

@universal(21)
export class AsnVideotexString extends AsnString {

  public static override readonly BER_IDENTIFIER = new Uint8Array([0x15]);
  public static readonly NAME = "VideotexString";

  public readonly name: typeof AsnVideotexString.NAME = AsnVideotexString.NAME;

}

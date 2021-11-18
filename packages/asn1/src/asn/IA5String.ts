import { AsnString } from "./String";
import { universal } from "./Types";

@universal(22)
export class AsnIA5String extends AsnString {

  public static override readonly BER_IDENTIFIER = new Uint8Array([0x16]);
  public static readonly NAME = "IA5String";

  public readonly name: typeof AsnIA5String.NAME = AsnIA5String.NAME;

}

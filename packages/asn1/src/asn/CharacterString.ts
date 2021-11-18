import { AsnString } from "./String";
import { universal } from "./Types";

@universal(29)
export class AsnCharacterString extends AsnString {

  public static override readonly BER_IDENTIFIER = new Uint8Array([0x1d]);
  public static readonly NAME = "CharacterString";

  public readonly name: typeof AsnCharacterString.NAME = AsnCharacterString.NAME;

}

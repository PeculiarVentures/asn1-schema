import { AsnString } from "./String";
import { universal } from "./Types";

@universal(25)
export class AsnGraphicString extends AsnString {

  public static override readonly BER_IDENTIFIER = new Uint8Array([0x19]);
  public static readonly NAME = "GraphicString";

  public readonly name: typeof AsnGraphicString.NAME = AsnGraphicString.NAME;

}

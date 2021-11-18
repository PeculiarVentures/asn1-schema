import { AsnObject } from "./Object";
import { universal } from "./Types";

@universal(5)
export class AsnNull extends AsnObject {

  public static override readonly BER_IDENTIFIER = new Uint8Array([0x05]);
  public static readonly NAME = "NULL";

  public readonly name: typeof AsnNull.NAME = AsnNull.NAME;
  public readonly value = null;

  protected toAsnString(): string {
    return this.name;
  }

}

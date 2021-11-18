import { AsnObject } from "./Object";
import { universal } from "./Types";

@universal(34)
export class AsnDuration extends AsnObject {

  public static override readonly BER_IDENTIFIER = new Uint8Array([0x1f, 0x22]);
  public static readonly NAME = "Duration";

  public readonly name: typeof AsnDuration.NAME = AsnDuration.NAME;

  protected override toAsnString(): string {
    return `${this.name}`;
  }

}

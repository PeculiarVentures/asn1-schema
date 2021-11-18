import { AsnObject } from "./Object";
import { universal } from "./Types";

@universal(14)
export class AsnTime extends AsnObject {
  public static override readonly BER_IDENTIFIER = new Uint8Array([0x0E]);
  public static readonly NAME = "TIME";

  public readonly name: typeof AsnTime.NAME = AsnTime.NAME;

  protected override toAsnString(): string {
    return `${this.name}`;
  }

}

import { AsnObject } from "./Object";
import { universal } from "./Types";

@universal(33)
export class AsnDateTime extends AsnObject {

  public static override readonly BER_IDENTIFIER = new Uint8Array([0x1f, 0x21]);
  public static readonly NAME = "Date";

  public readonly name: typeof AsnDateTime.NAME = AsnDateTime.NAME;

  protected override toAsnString(): string {
    return `${this.name}`;
  }

}

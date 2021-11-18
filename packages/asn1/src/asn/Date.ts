import { AsnString } from "./String";
import { AsnObject } from "./Object";
import { universal } from "./Types";

@universal(31)
export class AsnDate extends AsnString {

  public static override readonly BER_IDENTIFIER = new Uint8Array([0x1f, 0x1f]);
  public static readonly NAME = "Date";

  public override readonly name: typeof AsnDate.NAME = AsnDate.NAME;

  protected override toAsnString(): string {
    return `${this.name}`;
  }

}

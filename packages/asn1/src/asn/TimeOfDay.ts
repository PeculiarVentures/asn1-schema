import { AsnObject } from "./Object";
import { universal } from "./Types";

@universal(32)
export class AsnTimeOfDay extends AsnObject {

  public static override readonly BER_IDENTIFIER = new Uint8Array([0x1f, 0x20]);
  public static readonly NAME = "TimeOfDay";

  public readonly name: typeof AsnTimeOfDay.NAME = AsnTimeOfDay.NAME;

  protected override toAsnString(): string {
    return `${this.name}`;
  }
}

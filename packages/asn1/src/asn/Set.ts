import { AsnObject } from "./Object";
import { universal } from "./Types";

@universal(17)
export class AsnSet extends AsnObject {

  public static override readonly BER_IDENTIFIER = new Uint8Array([0x49]);
  public static readonly NAME = "SET";

  public readonly name: typeof AsnSet.NAME = AsnSet.NAME;

  constructor(items?: AsnObject[]) {
    super();

    if (items) {
      this.items = items;
    }
  }

  protected override toAsnString(): string {
    return `${this.name}`;
  }

}

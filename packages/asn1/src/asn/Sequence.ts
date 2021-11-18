import { AsnObject } from "./Object";
import { universal } from "./Types";

@universal(16)
export class AsnSequence extends AsnObject {

  public static override readonly BER_IDENTIFIER = new Uint8Array([0x48]);
  public static readonly NAME = "SEQUENCE";

  public readonly name: typeof AsnSequence.NAME = AsnSequence.NAME;

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

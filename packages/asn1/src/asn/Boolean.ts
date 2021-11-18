import { AsnObject } from "./Object";
import { universal } from "./Types";

@universal(1)
export class AsnBoolean extends AsnObject {

  public static override readonly BER_IDENTIFIER = new Uint8Array([0x01]);
  public static readonly NAME = "BOOLEAN";

  public readonly name: typeof AsnBoolean.NAME = AsnBoolean.NAME;

  constructor(value?: boolean) {
    super();

    this.content.view = new Uint8Array(1);

    if (value !== undefined) {
      this.content.view = new Uint8Array([+value]);
    }
  }

  public get value(): boolean {
    return !!this.content.view[0];
  }

  public set value(value: boolean) {
    this.content.view[0] = +value;
  }

  protected override toAsnString(): string {
    return `${this.name} ${this.value}`;
  }

}

import { BufferSource, BufferSourceConverter } from "pvtsutils";
import { Utils } from "..";
import { AsnObject } from "./Object";
import { universal } from "./Types";

@universal(3)
export class AsnBitString extends AsnObject {

  public static override readonly BER_IDENTIFIER = new Uint8Array([0x03]);
  public static readonly NAME = "BIT STRING";

  public readonly name: typeof AsnBitString.NAME = AsnBitString.NAME;

  constructor(value?: BufferSource, unusedBits = 0) {
    super();

    this.content.view = new Uint8Array(1);

    if (value !== undefined) {
      this.value = BufferSourceConverter.toUint8Array(value);
      this.unusedBits = unusedBits;
    }
  }

  public get unusedBits(): number {
    return this.content.view[0];
  }

  public set unusedBits(value: number) {
    this.content.view[0] = value;
  }

  public get value() {
    return this.content.view.subarray(1);
  }

  public set value(value: Uint8Array) {
    const unusedBits = this.unusedBits;

    const view = new Uint8Array(value.length + 1);
    view[0] = unusedBits;
    view.set(value, 1);

    this.content.view = view;
  }

  public getUint32(): number {
    const { value, unusedBits } = this;
    if (!value.length) {
      return 0;
    } else if (this.value.length > 4) {
      throw new Error("BitString value is greater than 32 bits");
    }

    const uint8view = new Uint8Array(4);
    uint8view.set(value, uint8view.byteLength - value.byteLength);
    const dataView = new DataView(uint8view.buffer);

    return dataView.getUint32(0) >> unusedBits;
  }

  protected override toAsnString(): string {
    const { name, value, unusedBits } = this;
    const asnName = (unusedBits)
      ? `${name} (${unusedBits} unused bits)`
      : `${name}`;

    let data = "";
    if (value.length > 4) {
      // hex view
      data = Utils.toHexString(this.value, "  ");
    } else {
      // bit view
      let uint32 = this.getUint32();
      const bitPadding = value.length * 8 - unusedBits;

      data = `  '${uint32.toString(2).padStart(bitPadding, "0")}'B`;
    }

    return `${asnName}\n${data}`;
  }

}

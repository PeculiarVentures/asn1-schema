import { BufferSource, BufferSourceConverter } from "pvtsutils";
import { ASNObject } from "./Object";


export class ASNBitString extends ASNObject {

  public static readonly DEFAULT_BER_IDENTIFIER = new Uint8Array([0x03]);

  constructor(value?: BufferSource, unusedBits = 0) {
    super();

    this.content.view = new Uint8Array(1);

    if (value !== undefined) {
      this.value = BufferSourceConverter.toUint8Array(this.value);
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

}

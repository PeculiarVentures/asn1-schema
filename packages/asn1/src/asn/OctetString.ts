import { BufferSource, BufferSourceConverter } from "pvtsutils";
import { AsnObject } from "./Object";

export class AsnOctetString extends AsnObject {

  public static override readonly DEFAULT_BER_IDENTIFIER = new Uint8Array([0x04]);

  constructor(value?: BufferSource) {
    super();

    if (value !== undefined) {
      this.value = BufferSourceConverter.toUint8Array(value);
    }
  }

  public get value() {
    return this.content.view;
  }

  public set value(value: Uint8Array) {
    this.content.view = value;
  }

}

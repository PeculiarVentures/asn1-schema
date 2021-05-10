import { BufferSource, BufferSourceConverter } from "pvtsutils";
import { ASNObject } from "./Object";

export class ASNOctetString extends ASNObject {

  public static readonly DEFAULT_BER_IDENTIFIER = new Uint8Array([0x04]);

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

import { Convert } from "pvtsutils";
import { ViewWriter } from "../ViewWriter";
import { ASNObject } from "./Object";

export class ASNEnumerated extends ASNObject {

  public static override readonly DEFAULT_BER_IDENTIFIER = new Uint8Array([0x0A]);

  constructor(value?: number) {
    super();

    if (value !== undefined) {
      this.value = value;
    }
  }

  public get value(): number {
    const hex = this.content.toString("hex");

    return Number(`0x${hex}`);
  }

  public set value(value: number) {
    const writer = new ViewWriter();

    const hex = value.toString(16);
    const view = new Uint8Array(Convert.FromHex(hex));

    if (value > 0 && view[0] & 0x80) {
      writer.writeByte(0);
    }
    writer.write(view);

    this.content.view = writer.toUint8Array();
  }

}

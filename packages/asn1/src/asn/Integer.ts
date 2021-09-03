import { BufferSourceConverter, Convert } from "pvtsutils";
import { ViewWriter } from "../ViewWriter";
import { AsnObject } from "./Object";
import { universal } from "./Types";


@universal(2)
export class AsnInteger extends AsnObject {

  public static override readonly DEFAULT_BER_IDENTIFIER = new Uint8Array([0x02]);

  constructor(value?: bigint | number) {
    super();

    if (value !== undefined) {
      this.value = BigInt(value);
    }
  }

  public get value(): bigint {
    const hex = this.content.toString("hex");

    if (this.content.view.length && this.content.view[0] & 0x80) {
      // a negative number
      const first = new Uint8Array(this.content.view.length);
      first[0] |= 0x80;

      const second = this.content.view.slice();
      second[0] |= 0x7F;

      const firstInt = BigInt(`0x${Convert.ToHex(first)}`);
      const secondInt = BigInt(`0x${Convert.ToHex(second)}`);

      return firstInt - secondInt;
    }

    // a positive number
    return BigInt(`0x${hex}`);
  }

  public set value(value: bigint) {
    const writer = new ViewWriter();

    let hex = value.toString(16).replace(/^-/, "");
    const view = new Uint8Array(Convert.FromHex(hex));

    if (value < 0) {
      // a negative number
      const first = new Uint8Array(view.length + (view[0] & 0x80 ? 1 : 0));
      first[0] |= 0x80;

      const firstInt = BigInt(`0x${Convert.ToHex(first)}`);
      const secondInt = firstInt + value;
      const second = BufferSourceConverter.toUint8Array(Convert.FromHex(secondInt.toString(16)));
      second[0] |= 0x80;

      writer.write(second);
    } else {
      // a positive number
      if (view[0] & 0x80) {
        writer.writeByte(0);
      }
      writer.write(view);
    }


    this.content.view = writer.toUint8Array();
  }

}

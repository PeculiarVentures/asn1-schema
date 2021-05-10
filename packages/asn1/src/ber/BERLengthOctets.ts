import { BEROctets } from "./BEROctets";
import { ViewReader } from "../ViewReader";
import { Utils } from "../Utils";
import { ViewWriter } from "../ViewWriter";

export enum BERLengthType {
  short,
  long,
  indefinite
}

export class BERLengthOctets extends BEROctets {

  public get type(): BERLengthType {
    const byte = this.view[0];
    if (byte < 0x80) {
      return BERLengthType.short;
    } else if (byte > 0x80) {
      return BERLengthType.long;
    }

    return BERLengthType.indefinite;
  }

  public get value(): number {
    const byte = this.view[0];
    if (byte < 0x80) {
      // short form
      return byte;
    } else if (byte > 0x80) {
      // long form
      const valueLength = byte & 0x7F;
      const valueView = this.view.subarray(1, 1 + valueLength);
      return Utils.toBase(valueView, 8);
    } else {
      // indefinite form
      return -1;
    }
  }

  public set value(value: number) {
    if (value > -1 && value < 0x80) {
      this.view = new Uint8Array([value]);
    } else if (value > 0x80) {
      const writer = new ViewWriter();

      const encodedLength = Utils.fromBase(value, 8);
      writer.writeByte(encodedLength.length | 0x80);
      writer.write(encodedLength);

      this.view = writer.toUint8Array();
    } else {
      this.view = new Uint8Array([0x80]);
    }
  }

  protected onFromBER(reader: ViewReader): void {
    const byte = reader.readByte();
    if (byte > 0x80) {
      // long form
      const valueLength = byte & 0x7F;
      // the value 11111111 shall not be used
      if (valueLength === 0x7F) {
        throw new Error("The value 0x7F shall not be used. This restriction is introduced for possible future extension");
      }
      reader.readBytes(valueLength);
    }
  }

}

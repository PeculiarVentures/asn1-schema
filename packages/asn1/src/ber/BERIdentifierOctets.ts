import { BEROctets } from "./BEROctets";
import { ViewReader } from "../ViewReader";
import { Utils } from "../Utils";
import { ViewWriter } from "../ViewWriter";

export enum BERTagClassFlags {
  universal = 0x00,
  application = 0x40,
  contextSpecific = 0x80,
  private = 0xC0,
}

export class BERIdentifierOctets extends BEROctets {

  public static readonly DEFAULT_TAG_NUMBER = BigInt(0);

  public get tagClass(): BERTagClassFlags {
    const octet = this.view[0] || 0;
    if ((octet & BERTagClassFlags.private) === BERTagClassFlags.private) {
      return BERTagClassFlags.private;
    }
    if (octet & BERTagClassFlags.contextSpecific) {
      return BERTagClassFlags.contextSpecific;
    }
    if (octet & BERTagClassFlags.application) {
      return BERTagClassFlags.application;
    }

    return BERTagClassFlags.universal;
  }

  public set tagClass(value: BERTagClassFlags) {
    // TODO view may be empty
    this.view[0] &= 0x3F; // disable bits
    this.view[0] |= value; // set value

    this.view = this.view.slice();
  }

  public get constructed(): boolean {
    const octet = this.view[0] || 0;

    return !!(octet & 0x20);
  }

  public set constructed(value: boolean) {
    this.view[0] &= 0xDF; // disable bit
    if (this.constructed) {
      this.view[0] |= 0x20; // set bit
    }

    this.view = this.view.slice();
  }

  public get tagNumber(): number {
    const byte = this.view[0] & 0X1F
    if (byte > 30) {
      // long
      return Utils.toBase(this.view.subarray(1).map(Utils.disableLastBit), 7);
    } else {
      // single
      return byte;
    }
  }

  public set tagNumber(value: number) {
    if (value < 31) {
      // single
      this.view[0] &= 0xE0;
      this.view[0] |= value;

      this.view = this.view.slice();
    } else {
      // long
      const writer = new ViewWriter();
      writer.writeByte(this.view[0] | 0x1F);
      const tagNumber = Utils.fromBase(value, 7).map(Utils.enableLastBit);
      writer.write(tagNumber);

      this.view = writer.toUint8Array();
    }
  }

  protected onFromBER(reader: ViewReader): void {
    const byte = reader.readByte();
    if ((byte & 0x1F) === 0x1F) {
      while (reader.readByte() & 0x80) {}
    }
  }

}

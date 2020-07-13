
import { BufferSourceConverter, Convert } from "pvtsutils";

export class ByteStream {
  protected view: Uint8Array;
  protected offset = 0;

  public get position() {
    return this.offset;
  }

  constructor(bytes: BufferSource) {
    this.view = BufferSourceConverter.toUint8Array(bytes);
  }

  public read(size: number = 1) {
    const res = this.view.slice(this.offset, this.offset + size);
    this.offset = this.offset + res.length;
    return res;
  }

  public readByte() {
    const bytes = this.read();
    if (!bytes.length) {
      throw new Error("End of stream");
    }
    return bytes[0];
  }

  public readNumber(size: number) {
    const bytes = this.read(size);
    const hex = Convert.ToHex(bytes);
    return parseInt(hex, 16);
  }

  public readEnd() {
    return this.read(this.view.length - this.offset);
  }

  public reset() {
    this.offset = 0;
  }
}
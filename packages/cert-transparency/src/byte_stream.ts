import { BufferSource, BufferSourceConverter, Convert } from "pvtsutils";

export class ByteStream {
  protected view: Uint8Array;
  protected offset = 0;

  public get position(): number {
    return this.offset;
  }

  constructor(bytes: BufferSource) {
    this.view = BufferSourceConverter.toUint8Array(bytes);
  }

  public read(size = 1): Uint8Array {
    const res = this.view.slice(this.offset, this.offset + size);
    this.offset = this.offset + res.length;

    return res;
  }

  public readByte(): number {
    const bytes = this.read();
    if (!bytes.length) {
      throw new Error("End of stream");
    }
    return bytes[0];
  }

  public readNumber(size: number): number {
    const bytes = this.read(size);
    const hex = Convert.ToHex(bytes);
    return parseInt(hex, 16);
  }

  public readEnd(): Uint8Array {
    return this.read(this.view.length - this.offset);
  }

  public reset(): void {
    this.offset = 0;
  }
}

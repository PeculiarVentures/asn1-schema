import { Convert } from "pvtsutils";

export class ViewWriter {

  private buffer: Uint8Array[] = [];

  public get length(): number {
    let length = 0;
    for (const child of this.buffer) {
      length += child.length;
    }

    return length;
  }

  public write(...data: Uint8Array[]): void {
    this.buffer.push(...data);
  }

  public writeByte(char: number): void {
    this.buffer.push(new Uint8Array([char]));
  }

  public writeStream(stream: ViewWriter): void {
    this.buffer.push(...stream.buffer);
  }

  public writeString(text: string): void {
    this.buffer.push(new Uint8Array(Convert.FromUtf8String(text)));
  }

  public toArrayBuffer(): ArrayBuffer {
    return this.toUint8Array().buffer;
  }

  public toUint8Array(): Uint8Array {
    const length = this.buffer
      .map(o => o.length)
      .reduce((prev, cur) => prev + cur);

    const res = new Uint8Array(length);
    let offset = 0;
    for (const item of this.buffer) {
      res.set(item, offset);
      offset += item.length;
    }

    return res;
  }

}

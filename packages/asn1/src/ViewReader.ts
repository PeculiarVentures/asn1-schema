import { BufferSourceConverter } from "pvtsutils";
import { BufferSource } from "pvtsutils";
import { ViewObject } from "./ViewObject";

export class ViewReader extends ViewObject {

  public position = 0;

  constructor(view: BufferSource) {
    super();

    this.view = BufferSourceConverter.toUint8Array(view);
  }

  public get length() {
    return this.view.length;
  }

  protected read(length?: number, moveCursor = false) {
    const start = this.position;
    const end = typeof length === "number"
      ? start + length
      : this.length - this.position;

    const subarray = this.view.subarray(start, end);

    if (moveCursor) {
      this.position += subarray.length;
    }

    if (length && subarray.length !== length) {
      throw new Error("End of view is reached");
    }

    return subarray;
  }

  public getBytes(length?: number) {
    return this.read(length);
  }

  public readBytes(length?: number) {
    return this.read(length, true);
  }

  public getByte(): number {
    const buf = this.getBytes(1);
    return buf[0];
  }

  public readByte(): number {
    const buf = this.read(1, true);
    return buf[0];
  }

  public subarray(start: number, end: number) {
    return this.view.subarray(start, end);
  }

  public skip(length: number): void {
    this.getBytes(length);
  }

  public begin() {
    this.position = 0;
  }

  public end() {
    this.position = this.view.byteLength;
  }
}

import { BufferSource, BufferSourceConverter } from "pvtsutils";

const HEX_ROW_SIZE = 16;
const HEX_ROW_COL_SIZE = 8;
const HEX_MAX_ROWS = 7;
export class Utils {

  public static toBase(data: BufferSource, base: number): number {
    const view = BufferSourceConverter.toUint8Array(data);
    let result = 0;
    for (let i = (view.length - 1); i >= 0; i--) {
      const octet = view[(view.length - 1) - i];
      const value = Math.pow(2, base * i);
      result += octet * value;
    }

    return result;
  }

  public static fromBase(value: number, base: number): Uint8Array {
    let internalValue = value;

    let result = 0;
    let biggest = Math.pow(2, base);
    for (let i = 1; i < 8; i++) {
      if (value < biggest) {
        const retView = new Uint8Array(i);
        result = i;

        for (let j = (i - 1); j >= 0; j--) {
          const basis = Math.pow(2, j * base);

          retView[result - j - 1] = Math.floor(internalValue / basis);
          internalValue -= (retView[result - j - 1]) * basis;
        }

        return retView;
      }

      biggest *= Math.pow(2, base);
    }

    return new Uint8Array(0);
  }

  public static enableLastBit(value: number, index: number, array: Uint8Array): number {
    if (index !== array.length - 1) {
      return value | 0x80;
    }
    // Don't enable 8 bit for the last element
    return value;
  }

  public static disableLastBit(value: number, index: number, array: Uint8Array): number {
    return value & 0x7F;
  }

  public static toHexString(source: BufferSource, startPadding = ""): string {
    const view = BufferSourceConverter.toUint8Array(source);

    const chunks: Uint8Array[] = [];
    let offset = 0;
    while (true) {
      const subarray = view.subarray(offset, offset + HEX_ROW_SIZE);
      if (subarray.length < HEX_ROW_SIZE) {
        if (subarray.length !== 0) {
          chunks.push(subarray);
        }
        break;
      }

      chunks.push(subarray);
      offset += HEX_ROW_SIZE
    }
    
    const rows: string[] = [];
    
    if (chunks.length > HEX_MAX_ROWS) {
      const start = chunks.slice(0, HEX_MAX_ROWS - 2);
      const end = chunks.slice(chunks.length - 2);
      const skippingBytes = (chunks.length - HEX_MAX_ROWS) * HEX_ROW_SIZE;

      for (const item of start) {
        rows.push(`${startPadding}${this.toSingleLineHex(item)}`);
      }
      rows.push(`${startPadding}...skipping ${skippingBytes} bytes...`);
      for (const item of end) {
        rows.push(`${startPadding}${this.toSingleLineHex(item)}`);
      }
    } else {
      for (const item of chunks) {
        rows.push(`${startPadding}${this.toSingleLineHex(item)}`);
      }
    }

    return rows.join("\n")
  }

  protected static toSingleLineHex(view: Uint8Array): string {
    const values: string[] = [];

    for(let i = 0; i< view.length; i++) {
      const byte = view[i];

      if (i && i % HEX_ROW_COL_SIZE === 0) {
        values.push(""); // extra padding
      }

      values.push(byte.toString(16).toUpperCase().padStart(2, "0"));
    }

    return values.join(" ");
  }

}
import { BufferSource, BufferSourceConverter } from "pvtsutils";

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

}
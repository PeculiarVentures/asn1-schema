import * as asn1js from "asn1js";
import { BufferSource, BufferSourceConverter } from "pvtsutils";
import { IAsnConvertible } from "../types";

export class BitString<T extends number = number> implements IAsnConvertible {

  public unusedBits = 0;

  public value = new ArrayBuffer(0);

  constructor();
  constructor(value: T);
  constructor(value: BufferSource, unusedBits?: number);
  constructor(params?: any, unusedBits = 0) {
    if (params) {
      if (typeof params === "number") {
        this.fromNumber(params as T);
      } else if (BufferSourceConverter.isBufferSource(params)) {
        this.unusedBits = unusedBits;
        this.value = BufferSourceConverter.toArrayBuffer(params);
      } else {
        throw TypeError("Unsupported type of 'params' argument for BitString");
      }
    }
  }

  public fromASN(asn: any): this {
    if (!(asn instanceof asn1js.BitString)) {
      throw new TypeError("Argument 'asn' is not instance of ASN.1 BitString");
    }

    this.unusedBits = asn.valueBlock.unusedBits;
    this.value = asn.valueBlock.valueHex;

    return this;
  }

  public toASN() {
    return new asn1js.BitString({ unusedBits: this.unusedBits, valueHex: this.value });
  }

  public toSchema(name: string) {
    return new asn1js.BitString({ name } as any);
  }

  public toNumber() {
    let res = "";
    const uintArray = new Uint8Array(this.value);
    for (const octet of uintArray) {
      res += octet.toString(2).padStart(8, "0");
    }
    res = res.split("").reverse().join(""); // reverse bits
    if (this.unusedBits) {
      // disable unused bits
      res = res.slice(this.unusedBits).padStart(this.unusedBits, "0");
    }
    return parseInt(res, 2) as T;
  }

  public fromNumber(value: T) {
    let bits = value.toString(2);
    const octetSize = (bits.length + 7) >> 3;
    this.unusedBits = (octetSize << 3) - bits.length;
    const octets = new Uint8Array(octetSize);

    bits = bits.padStart(octetSize << 3, "0").split("").reverse().join("");
    let index = 0;
    while (index < octetSize) {
      octets[index] = parseInt(bits.slice(index << 3, (index << 3) + 8), 2);
      index++;
    }

    this.value = octets.buffer;
  }

}
import { OctetString as AsnOctetString } from "asn1js";
import { BufferSourceConverter } from "pvtsutils";
import { IAsnConvertible } from "../types";

export class OctetString implements IAsnConvertible, ArrayBufferView {

  public buffer: ArrayBuffer;
  public get byteLength() {
    return this.buffer.byteLength;
  }
  public get byteOffset() {
    return 0;
  }

  constructor();
  constructor(byteLength: number);
  constructor(bytes: number[]);
  constructor(bytes: BufferSource);
  constructor(param?: BufferSource | number | number[]) {
    if (typeof param === "number") {
      this.buffer = new ArrayBuffer(param);
    } else {
      if (BufferSourceConverter.isBufferSource(param)) {
        this.buffer = BufferSourceConverter.toArrayBuffer(param);
      } else if (Array.isArray(param)) {
        this.buffer = new Uint8Array(param);
      } else {
        this.buffer = new ArrayBuffer(0);
      }
    }
  }

  public fromASN(asn: any): this {
    if (!(asn instanceof AsnOctetString)) {
      throw new TypeError("Argument 'asn' is not instance of ASN.1 OctetString");
    }
    this.buffer = asn.valueBlock.valueHex;
    return this;
  }

  public toASN() {
    return new AsnOctetString({ valueHex: this.buffer });
  }

  public toSchema(name: string) {
    return new AsnOctetString({ name } as any);
  }

}

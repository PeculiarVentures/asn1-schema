import * as asn1js from "asn1js";
import { BufferSource, BufferSourceConverter } from "pvtsutils";
import { IAsnConvertible } from "../types";

// Implement ArrayBufferView, cause ES5 doesn't allow to extend ArrayBuffer class

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

  public fromASN(asn: asn1js.OctetString): this {
    if (!(asn instanceof asn1js.OctetString)) {
      throw new TypeError("Argument 'asn' is not instance of ASN.1 OctetString");
    }
    this.buffer = asn.valueBlock.valueHexView;
    return this;
  }

  public toASN() {
    return new asn1js.OctetString({ valueHex: this.buffer });
  }

  public toSchema(name: string) {
    return new asn1js.OctetString({ name });
  }

}

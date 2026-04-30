import * as asn1js from "asn1js";
import {
  BufferSourceLike, isBufferSource, toArrayBuffer,
} from "@peculiar/utils/bytes";
import { IAsnConvertible } from "../types";

// Implement ArrayBufferView, cause ES5 doesn't allow to extend ArrayBuffer class

export class OctetString implements IAsnConvertible, ArrayBufferView {
  public buffer: ArrayBuffer;
  public get byteLength(): number {
    return this.buffer.byteLength;
  }

  // eslint-disable-next-line @typescript-eslint/class-literal-property-style
  public get byteOffset(): number {
    return 0;
  }

  constructor();
  constructor(byteLength: number);
  constructor(bytes: number[]);
  constructor(bytes: BufferSourceLike);
  constructor(param?: BufferSourceLike | number | number[]) {
    if (typeof param === "number") {
      this.buffer = new ArrayBuffer(param);
    } else {
      if (isBufferSource(param)) {
        this.buffer = toArrayBuffer(param);
      } else if (Array.isArray(param)) {
        this.buffer = new Uint8Array(param).buffer;
      } else {
        this.buffer = new ArrayBuffer(0);
      }
    }
  }

  public fromASN(asn: asn1js.OctetString): this {
    if (!(asn instanceof asn1js.OctetString)) {
      throw new TypeError("Argument 'asn' is not instance of ASN.1 OctetString");
    }
    this.buffer = toArrayBuffer(asn.valueBlock.valueHex);
    return this;
  }

  public toASN(): asn1js.OctetString {
    return new asn1js.OctetString({ valueHex: this.buffer });
  }

  public toSchema(name: string): asn1js.OctetString {
    return new asn1js.OctetString({ name });
  }
}

import { OctetString as AsnOctetString } from "asn1js";
import { BufferSourceConverter } from "pvtsutils";
import { IAsnConvertible } from "../types";

export class OctetString extends ArrayBuffer implements IAsnConvertible {

  constructor();
  constructor(byteLength: number);
  constructor(bytes: number[]);
  constructor(bytes: BufferSource);
  constructor(param?: BufferSource | number | number[]) {
    if (typeof param === "number") {
      super(param);
    } else {
      if (BufferSourceConverter.isBufferSource(param)) {
        super(param.byteLength);
        const view = new Uint8Array(this);
        view.set(BufferSourceConverter.toUint8Array(param));
      } else if (Array.isArray(param)) {
        var array = new Uint8Array(param);
        super(array.length);
        var view = new Uint8Array(this);
        view.set(array);
      } else {
        super(0);
      }
    }
  }

  public fromASN(asn: any): this {
    if (!(asn instanceof AsnOctetString)) {
      throw new TypeError("Argument 'asn' is not instance of ASN.1 OctetString");
    }
    return new (this.constructor as any)(asn.valueBlock.valueHex) as any;
  }

  public toASN() {
    return new AsnOctetString({ valueHex: this });
  }

  public toSchema(name: string) {
    return new AsnOctetString({ name } as any);
  }

}

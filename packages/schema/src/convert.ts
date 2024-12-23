import * as asn1js from "asn1js";
import { BufferSource, BufferSourceConverter } from "pvtsutils";
import { AsnParser } from "./parser";
import { IEmptyConstructor } from "./types";
import { AsnSerializer } from "./serializer";

export class AsnConvert {
  public static serialize(obj: unknown): ArrayBuffer {
    return AsnSerializer.serialize(obj);
  }

  public static parse<T>(data: BufferSource, target: IEmptyConstructor<T>): T {
    return AsnParser.parse(data, target);
  }

  /**
   * Returns a string representation of an ASN.1 encoded data
   * @param data ASN.1 encoded buffer source
   * @returns String representation of ASN.1 structure
   */
  public static toString(data: BufferSource): string;
  /**
   * Returns a string representation of an ASN.1 schema
   * @param obj Object which can be serialized to ASN.1 schema
   * @returns String representation of ASN.1 structure
   */
  public static toString(obj: unknown): string;
  public static toString(data: unknown): string {
    const buf = BufferSourceConverter.isBufferSource(data)
      ? BufferSourceConverter.toArrayBuffer(data)
      : AsnConvert.serialize(data);
    const asn = asn1js.fromBER(buf);

    if (asn.offset === -1) {
      throw new Error(`Cannot decode ASN.1 data. ${asn.result.error}`);
    }

    return asn.result.toString();
  }
}

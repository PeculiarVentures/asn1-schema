import * as asn1js from "asn1js";
import {
  type BufferSourceLike, isBufferSource, toArrayBuffer,
} from "@peculiar/utils/bytes";
import { AsnParser } from "./parser";
import { IEmptyConstructor, IAsnParseOptions } from "./types";
import { AsnSerializer } from "./serializer";

export class AsnConvert {
  public static serialize(obj: unknown): ArrayBuffer {
    return AsnSerializer.serialize(obj);
  }

  public static parse<T>(
    data: BufferSourceLike,
    target: IEmptyConstructor<T>,
    options?: IAsnParseOptions,
  ): T {
    return AsnParser.parse(data, target, options);
  }

  /**
   * Returns a string representation of an ASN.1 encoded data
   * @param data ASN.1 encoded buffer source
   * @param options Optional parsing options forwarded to `asn1js.fromBER`
   * @returns String representation of ASN.1 structure
   */
  public static toString(data: BufferSourceLike, options?: IAsnParseOptions): string;
  /**
   * Returns a string representation of an ASN.1 schema
   * @param obj Object which can be serialized to ASN.1 schema
   * @param options Optional parsing options forwarded to `asn1js.fromBER`
   * @returns String representation of ASN.1 structure
   */
  public static toString(obj: unknown, options?: IAsnParseOptions): string;
  public static toString(data: unknown, options?: IAsnParseOptions): string {
    const buf = isBufferSource(data)
      ? toArrayBuffer(data)
      : AsnConvert.serialize(data);
    const asn = asn1js.fromBER(buf, options?.berOptions);

    if (asn.offset === -1) {
      throw new Error(`Cannot decode ASN.1 data. ${asn.result.error}`);
    }

    return asn.result.toString();
  }
}

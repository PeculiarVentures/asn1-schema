import { dumpAsn } from "@peculiar/asn1-dump";
import { BufferSource, BufferSourceConverter } from "pvtsutils";
import { AsnParser } from "./parser";
import { IEmptyConstructor } from "./types";
import { AsnSerializer } from "./serializer";

export class AsnConvert {
  public static serialize(obj: unknown): ArrayBuffer {
    return AsnSerializer.serialize(obj);
  }

  public static parse<T>(data: BufferSource, target: IEmptyConstructor<T>): T {
    // Back-compat: accept OctetString-like objects (have ArrayBuffer 'buffer')
    // even if BufferSourceConverter doesn't recognize them (custom ArrayBufferView implementation).
    if (!BufferSourceConverter.isBufferSource(data)) {
      const anyData = data as unknown as { buffer?: unknown };
      if (anyData && typeof anyData === "object" && anyData.buffer instanceof ArrayBuffer) {
        return AsnParser.parse(anyData.buffer, target);
      }
    }
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
  public static toString(dataOrObj: unknown): string {
    const buf = BufferSourceConverter.isBufferSource(dataOrObj)
      ? new Uint8Array(BufferSourceConverter.toArrayBuffer(dataOrObj as BufferSource))
      : new Uint8Array(AsnConvert.serialize(dataOrObj));
    // Default style "dev" per TASK2.md
    return dumpAsn(buf, { style: "plain" });
  }
}

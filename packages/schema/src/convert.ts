import type { BufferSource } from "pvtsutils";
import { AsnParser } from "./parser";
import { IEmptyConstructor } from "./types";
import { AsnSerializer } from "./serializer";

export class AsnConvert {
  
  public static serialize(obj: any) {
    return AsnSerializer.serialize(obj);
  }

  public static parse<T>(data: BufferSource, target: IEmptyConstructor<T>): T {
    return AsnParser.parse(data, target);
  }
}
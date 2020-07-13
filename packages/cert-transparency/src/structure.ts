import { BufferSourceConverter } from "pvtsutils";
import { ByteStream } from "./byte_stream";

export abstract class Structure {

  public abstract parse(bytes?: ByteStream): void;

  public static createStream(bytes: BufferSource) {
    const view = BufferSourceConverter.toUint8Array(bytes);
    return new ByteStream(view);
  }
}
import { toUint8Array, type BufferSourceLike } from "@peculiar/utils/bytes";
import { ByteStream } from "./byte_stream";

export abstract class Structure {
  public abstract parse(bytes?: ByteStream): void;

  public static createStream(bytes: BufferSourceLike): ByteStream {
    const view = toUint8Array(bytes);
    return new ByteStream(view);
  }
}

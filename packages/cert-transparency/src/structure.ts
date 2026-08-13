import { toUint8Array, type BufferSourceLike } from "@peculiar/utils/bytes";
import { ByteStream } from "@peculiar/asn1-tls";

export abstract class Structure {
  public abstract parse(bytes?: ByteStream): void;

  public static createStream(bytes: BufferSourceLike): ByteStream {
    const view = toUint8Array(bytes);
    return new ByteStream(view);
  }
}

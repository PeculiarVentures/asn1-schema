import { toUint8Array, type BufferSourceLike } from "@peculiar/utils/bytes";

/**
 * Minimal reader for the TLS presentation language encoding used by
 * {@link MTCProof}. Unlike a plain cursor it raises on truncation, so a
 * malformed proof fails loudly instead of yielding short reads.
 */
export class ByteStream {
  protected view: Uint8Array;
  protected offset = 0;

  public get position(): number {
    return this.offset;
  }

  public get left(): number {
    return this.view.length - this.offset;
  }

  constructor(bytes: BufferSourceLike) {
    this.view = toUint8Array(bytes);
  }

  public read(size: number): Uint8Array {
    if (this.left < size) {
      throw new RangeError(`End of stream: needed ${size} byte(s), ${this.left} remaining`);
    }
    const res = this.view.subarray(this.offset, this.offset + size);
    this.offset += size;

    return res;
  }

  /** Reads a big-endian unsigned integer of `size` bytes. `size` is at most 6. */
  public readNumber(size: number): number {
    const bytes = this.read(size);
    let res = 0;
    for (const byte of bytes) {
      res = res * 256 + byte;
    }

    return res;
  }

  /** Reads a variable-length vector whose length is prefixed with `size` bytes. */
  public readVector(size: number): Uint8Array {
    return this.read(this.readNumber(size));
  }
}

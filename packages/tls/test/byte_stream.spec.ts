import * as assert from "node:assert";
import { ByteStream } from "../src";

describe("tls", () => {
  describe("ByteStream", () => {
    it("position and left", () => {
      const stream = new ByteStream(new Uint8Array([1, 2, 3, 4]));
      assert.strictEqual(stream.position, 0);
      assert.strictEqual(stream.left, 4);
      stream.read(2);
      assert.strictEqual(stream.position, 2);
      assert.strictEqual(stream.left, 2);
    });

    it("read returns a subarray view and advances", () => {
      const bytes = new Uint8Array([1, 2, 3, 4, 5]);
      const stream = new ByteStream(bytes);
      const res = stream.read(3);
      assert.deepStrictEqual(Array.from(res), [1, 2, 3]);
      // The view aliases the underlying buffer, it is not a copy.
      assert.strictEqual(res.buffer, bytes.buffer);
      assert.strictEqual(stream.position, 3);
      assert.strictEqual(stream.left, 2);
    });

    it("read throws RangeError on truncation", () => {
      const stream = new ByteStream(new Uint8Array([1, 2]));
      assert.throws(() => stream.read(3), RangeError);
      // A failing read must not consume bytes.
      assert.strictEqual(stream.position, 0);
    });

    it("readByte reads a single byte", () => {
      const stream = new ByteStream(new Uint8Array([0xab, 0xcd]));
      assert.strictEqual(stream.readByte(), 0xab);
      assert.strictEqual(stream.readByte(), 0xcd);
      assert.strictEqual(stream.left, 0);
      assert.throws(() => stream.readByte(), RangeError);
    });

    it("readNumber reads a big-endian unsigned integer", () => {
      const stream = new ByteStream(new Uint8Array([0x01, 0x02, 0xff, 0x80, 0x00, 0x00, 0x00, 0x00]));
      assert.strictEqual(stream.readNumber(1), 0x01);
      assert.strictEqual(stream.readNumber(2), 0x02ff);
      assert.strictEqual(stream.readNumber(4), 0x80000000);
    });

    it("readEnd reads the remaining bytes", () => {
      const stream = new ByteStream(new Uint8Array([1, 2, 3, 4, 5]));
      stream.read(2);
      const res = stream.readEnd();
      assert.deepStrictEqual(Array.from(res), [3, 4, 5]);
      assert.strictEqual(stream.left, 0);
      assert.strictEqual(stream.readEnd().length, 0);
    });

    it("readVector reads a length-prefixed vector", () => {
      const stream = new ByteStream(new Uint8Array([0x00, 0x03, 0xaa, 0xbb, 0xcc]));
      const res = stream.readVector(2);
      assert.deepStrictEqual(Array.from(res), [0xaa, 0xbb, 0xcc]);
      assert.strictEqual(stream.left, 0);
    });

    it("readVector throws when the declared length overruns", () => {
      const stream = new ByteStream(new Uint8Array([0x00, 0x05, 0xaa]));
      assert.throws(() => stream.readVector(2), RangeError);
    });

    it("reset rewinds the cursor", () => {
      const stream = new ByteStream(new Uint8Array([1, 2, 3]));
      stream.read(2);
      stream.reset();
      assert.strictEqual(stream.position, 0);
      assert.strictEqual(stream.left, 3);
      assert.strictEqual(stream.readByte(), 1);
    });
  });
});

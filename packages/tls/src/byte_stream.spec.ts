import { describe, expect, it } from "vitest";
import { ByteStream } from "./index";

describe("tls", () => {
  describe("ByteStream", () => {
    it("position and left", () => {
      const stream = new ByteStream(new Uint8Array([1, 2, 3, 4]));
      expect(stream.position).toBe(0);
      expect(stream.left).toBe(4);
      stream.read(2);
      expect(stream.position).toBe(2);
      expect(stream.left).toBe(2);
    });

    it("read returns a subarray view and advances", () => {
      const bytes = new Uint8Array([1, 2, 3, 4, 5]);
      const stream = new ByteStream(bytes);
      const res = stream.read(3);
      expect(Array.from(res)).toStrictEqual([1, 2, 3]);
      // The view aliases the underlying buffer, it is not a copy.
      expect(res.buffer).toBe(bytes.buffer);
      expect(stream.position).toBe(3);
      expect(stream.left).toBe(2);
    });

    it("read throws RangeError on truncation", () => {
      const stream = new ByteStream(new Uint8Array([1, 2]));
      expect(() => stream.read(3)).toThrow(RangeError);
      // A failing read must not consume bytes.
      expect(stream.position).toBe(0);
    });

    it("readByte reads a single byte", () => {
      const stream = new ByteStream(new Uint8Array([0xab, 0xcd]));
      expect(stream.readByte()).toBe(0xab);
      expect(stream.readByte()).toBe(0xcd);
      expect(stream.left).toBe(0);
      expect(() => stream.readByte()).toThrow(RangeError);
    });

    it("readNumber reads a big-endian unsigned integer", () => {
      const stream = new ByteStream(new Uint8Array([0x01, 0x02, 0xff, 0x80, 0x00, 0x00, 0x00, 0x00]));
      expect(stream.readNumber(1)).toBe(0x01);
      expect(stream.readNumber(2)).toBe(0x02ff);
      expect(stream.readNumber(4)).toBe(0x80000000);
    });

    it("readEnd reads the remaining bytes", () => {
      const stream = new ByteStream(new Uint8Array([1, 2, 3, 4, 5]));
      stream.read(2);
      const res = stream.readEnd();
      expect(Array.from(res)).toStrictEqual([3, 4, 5]);
      expect(stream.left).toBe(0);
      expect(stream.readEnd().length).toBe(0);
    });

    it("readVector reads a length-prefixed vector", () => {
      const stream = new ByteStream(new Uint8Array([0x00, 0x03, 0xaa, 0xbb, 0xcc]));
      const res = stream.readVector(2);
      expect(Array.from(res)).toStrictEqual([0xaa, 0xbb, 0xcc]);
      expect(stream.left).toBe(0);
    });

    it("readVector throws when the declared length overruns", () => {
      const stream = new ByteStream(new Uint8Array([0x00, 0x05, 0xaa]));
      expect(() => stream.readVector(2)).toThrow(RangeError);
    });

    it("reset rewinds the cursor", () => {
      const stream = new ByteStream(new Uint8Array([1, 2, 3]));
      stream.read(2);
      stream.reset();
      expect(stream.position).toBe(0);
      expect(stream.left).toBe(3);
      expect(stream.readByte()).toBe(1);
    });
  });
});

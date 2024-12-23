import { IpConverter } from "../src/ip_converter";
import * as assert from "assert";

describe("IpConverter", () => {
  describe("toString", () => {
    it("converts IPv4 address", () => {
      const input = new Uint8Array([192, 168, 0, 1]).buffer;
      assert.strictEqual(IpConverter.toString(input), "192.168.0.1");
    });

    it("converts IPv6 address", () => {
      const input = new Uint8Array([
        0x20, 0x01, 0x0d, 0xb8, 0x85, 0xa3, 0x00, 0x00, 0x00, 0x00, 0x8a, 0x2e, 0x03, 0x70, 0x73,
        0x34,
      ]).buffer;
      assert.strictEqual(IpConverter.toString(input), "2001:db8:85a3::8a2e:370:7334");
    });

    it("converts IPv4 with netmask", () => {
      const input = new Uint8Array([
        192,
        168,
        0,
        0, // IP
        255,
        255,
        255,
        0, // Mask
      ]).buffer;
      assert.strictEqual(IpConverter.toString(input), "192.168.0.0/24 (mask 255.255.255.0)");
    });

    it("converts IPv4 with different netmask", () => {
      const input = new Uint8Array([
        10,
        24,
        0,
        0, // IP
        255,
        255,
        248,
        0, // Mask
      ]).buffer;
      assert.strictEqual(IpConverter.toString(input), "10.24.0.0/21 (mask 255.255.248.0)");
    });

    it("converts IPv6 with netmask", () => {
      const input = new Uint8Array([
        0x20, 0x01, 0x0d, 0xb8, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00,
        0x00, 0xff, 0xff, 0xff, 0xff, 0xff, 0xff, 0xff, 0xff, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00,
        0x00, 0x00,
      ]).buffer;
      assert.strictEqual(IpConverter.toString(input), "2001:db8::/64");
    });

    it("handles special case IPv4 0.0.0.0/0", () => {
      const input = new Uint8Array(8).buffer; // All zeros, 8 bytes for IPv4
      assert.strictEqual(IpConverter.toString(input), "0.0.0.0/0");
    });

    it("handles special case IPv6 ::/0", () => {
      const input = new Uint8Array(32).buffer; // All zeros, 32 bytes for IPv6
      assert.strictEqual(IpConverter.toString(input), "::/0");
    });
  });

  describe("fromString", () => {
    it("parses IPv4 address", () => {
      const result = IpConverter.fromString("192.168.0.1");
      assert.deepStrictEqual(Array.from(new Uint8Array(result)), [192, 168, 0, 1]);
    });

    it("parses IPv6 address", () => {
      const result = IpConverter.fromString("2001:db8:85a3::8a2e:370:7334");
      assert.deepStrictEqual(
        Array.from(new Uint8Array(result)),
        [
          0x20, 0x01, 0x0d, 0xb8, 0x85, 0xa3, 0x00, 0x00, 0x00, 0x00, 0x8a, 0x2e, 0x03, 0x70, 0x73,
          0x34,
        ],
      );
    });

    it("parses IPv4 CIDR notation", () => {
      const result = IpConverter.fromString("192.168.0.0/24");
      assert.deepStrictEqual(Array.from(new Uint8Array(result)), [
        192,
        168,
        0,
        0, // IP
        255,
        255,
        255,
        0, // Mask
      ]);
    });

    it("parses IPv6 CIDR notation", () => {
      const result = IpConverter.fromString("2001:db8::/64");
      const expected = new Uint8Array(32);
      expected.set([0x20, 0x01, 0x0d, 0xb8], 0);
      expected.set([0xff, 0xff, 0xff, 0xff, 0xff, 0xff, 0xff, 0xff], 16);
      assert.deepStrictEqual(Array.from(new Uint8Array(result)), Array.from(expected));
    });

    it("parses IPv4 with mask string notation", () => {
      const result = IpConverter.fromString("192.168.0.0/24 (mask 255.255.255.0)");
      assert.deepStrictEqual(Array.from(new Uint8Array(result)), [
        192,
        168,
        0,
        0, // IP
        255,
        255,
        255,
        0, // Mask
      ]);
    });

    it("parses complex IPv4 with mask string notation", () => {
      const result = IpConverter.fromString("10.24.0.0/21 (mask 255.255.248.0)");
      assert.deepStrictEqual(Array.from(new Uint8Array(result)), [
        10,
        24,
        0,
        0, // IP
        255,
        255,
        248,
        0, // Mask
      ]);
    });

    it("throws on invalid IP", () => {
      assert.throws(() => {
        IpConverter.fromString("invalid");
      });
    });

    it("throws on invalid CIDR", () => {
      assert.throws(() => {
        IpConverter.fromString("192.168.0.0/33");
      });
    });
  });
});

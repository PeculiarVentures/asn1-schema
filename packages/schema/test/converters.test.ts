import { describe, it, assert } from "vitest";
import { AsnSerializer, ParseContextImpl } from "@peculiar/asn1-codec";
import {
  AsnAnyConverter,
  AsnConstructedOctetStringConverter,
  AsnGeneralizedTimeConverter,
  AsnUTCTimeConverter,
  OctetString,
} from "../src";

describe("converters", () => {
  describe("Any", () => {
    it("null", () => {
      const node = AsnAnyConverter.toASN(null);

      const der = AsnSerializer.nodeToBytes(node);
      assert.strictEqual(Buffer.from(der).toString("hex"), "0500");

      const context = new ParseContextImpl(der, null);
      const value = AsnAnyConverter.fromASN({ node, context });
      assert.strictEqual(value, null);
    });
    it("Integer", () => {
      const node = AsnAnyConverter.toASN(new Uint8Array([2, 1, 1]).buffer);

      const der = AsnSerializer.nodeToBytes(node);
      assert.strictEqual(Buffer.from(der).toString("hex"), "020101");

      const context = new ParseContextImpl(der, null);
      const value = AsnAnyConverter.fromASN({ node, context });
      assert.ok(value);
      assert.strictEqual(value.byteLength, 3);
    });
    it("Throw error on wrong encoded value", () => {
      assert.throws(() => {
        AsnAnyConverter.toASN(new Uint8Array([2, 5, 1]).buffer); // wrong length
      });
    });
  });

  describe("GeneralizedTime", () => {
    const dateNum = 1537560204455;
    it("correct", () => {
      const node = AsnGeneralizedTimeConverter.toASN(new Date(dateNum));

      const der = AsnSerializer.nodeToBytes(node);
      assert.strictEqual(
        Buffer.from(der).toString("hex"),
        "181332303138303932313230303332342e3435355a",
      );

      const context = new ParseContextImpl(der, null);
      const value = AsnGeneralizedTimeConverter.fromASN({ node, context });
      assert.strictEqual(value.getTime(), dateNum);
    });
  });

  describe("UTCTime", () => {
    const dateNum = 1537560204000;
    it("correct", () => {
      const node = AsnUTCTimeConverter.toASN(new Date(dateNum));

      const der = AsnSerializer.nodeToBytes(node);
      assert.strictEqual(Buffer.from(der).toString("hex"), "170d3138303932313230303332345a");

      const context = new ParseContextImpl(der, null);
      const value = AsnUTCTimeConverter.fromASN({ node, context });
      assert.strictEqual(value.getTime(), dateNum);
    });
  });

  describe("ConstructedOctetStringConverter", () => {
    const buffer = Buffer.from("12345", "ascii");
    it("correct", () => {
      const asn = AsnConstructedOctetStringConverter.toASN(new OctetString(buffer));

      const der = AsnSerializer.nodeToBytes(asn);
      assert.strictEqual(Buffer.from(der).toString("hex"), "04053132333435");

      const context = new ParseContextImpl(der, null);
      const value = AsnConstructedOctetStringConverter.fromASN({ node: asn, context });
      assert.notStrictEqual(Buffer.from(value.buffer), buffer);
    });
  });
});

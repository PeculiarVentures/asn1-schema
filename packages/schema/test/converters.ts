import * as assert from "assert";
import {
  AsnAnyConverter,
  AsnConstructedOctetStringConverter,
  AsnGeneralizedTimeConverter,
  AsnUTCTimeConverter,
  OctetString,
} from "../src";

context("converters", () => {
  context("Any", () => {
    it("null", () => {
      const asn = AsnAnyConverter.toASN(null);

      const der = asn.toBER();
      assert.strictEqual(Buffer.from(der).toString("hex"), "0500");

      const value = AsnAnyConverter.fromASN(asn);
      assert.strictEqual(value, null);
    });
    it("Integer", () => {
      const asn = AsnAnyConverter.toASN(new Uint8Array([2, 1, 1]).buffer);

      const der = asn.toBER();
      assert.strictEqual(Buffer.from(der).toString("hex"), "020101");

      const value = AsnAnyConverter.fromASN(asn);
      assert.ok(value);
      assert.strictEqual(value.byteLength, 3);
    });
    it("Throw error on wrong encoded value", () => {
      assert.throws(() => {
        AsnAnyConverter.toASN(new Uint8Array([2, 5, 1]).buffer); // wrong length
      });
    });
  });

  context("GeneralizedTime", () => {
    const dateNum = 1537560204455;
    it("correct", () => {
      const asn = AsnGeneralizedTimeConverter.toASN(new Date(dateNum));

      const der = asn.toBER();
      assert.strictEqual(
        Buffer.from(der).toString("hex"),
        "181332303138303932313230303332342e3435355a",
      );

      const value = AsnGeneralizedTimeConverter.fromASN(asn);
      assert.strictEqual(value.getTime(), dateNum);
    });
  });

  context("UTCTime", () => {
    const dateNum = 1537560204000;
    it("correct", () => {
      const asn = AsnUTCTimeConverter.toASN(new Date(dateNum));

      const der = asn.toBER();
      assert.strictEqual(Buffer.from(der).toString("hex"), "170d3138303932313230303332345a");

      const value = AsnUTCTimeConverter.fromASN(asn);
      assert.strictEqual(value.getTime(), dateNum);
    });
  });

  context("ConstructedOctetStringConverter", () => {
    const buffer = Buffer.from("12345", "ascii");
    it("correct", () => {
      const asn = AsnConstructedOctetStringConverter.toASN(new OctetString(buffer));

      const der = asn.toBER();
      assert.strictEqual(Buffer.from(der).toString("hex"), "04053132333435");

      const value = AsnConstructedOctetStringConverter.fromASN(asn);
      assert.notStrictEqual(Buffer.from(value.buffer), buffer);
    });
  });
});

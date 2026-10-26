import { describe, expect, it } from "vitest";
import { AsnAnyConverter, AsnConstructedOctetStringConverter, AsnGeneralizedTimeConverter, AsnUTCTimeConverter, OctetString } from "./index";

describe("converters", () => {
  describe("Any", () => {
    it("null", () => {
      const asn = AsnAnyConverter.toASN(null);

      const der = asn.toBER();
      expect(Buffer.from(der).toString("hex")).toBe("0500");

      const value = AsnAnyConverter.fromASN(asn);
      expect(value).toBe(null);
    });
    it("Integer", () => {
      const asn = AsnAnyConverter.toASN(new Uint8Array([2, 1, 1]).buffer);

      const der = asn.toBER();
      expect(Buffer.from(der).toString("hex")).toBe("020101");

      const value = AsnAnyConverter.fromASN(asn);
      expect(value).toBeTruthy();
      expect(value!.byteLength).toBe(3);
    });
    it("Throw error on wrong encoded value", () => {
      expect(() => {
        AsnAnyConverter.toASN(new Uint8Array([2, 5, 1]).buffer); // wrong length
      }).toThrow();
    });
  });

  describe("GeneralizedTime", () => {
    const dateNum = 1537560204455;
    it("correct", () => {
      const asn = AsnGeneralizedTimeConverter.toASN(new Date(dateNum));

      const der = asn.toBER();
      expect(Buffer.from(der).toString("hex")).toBe("181332303138303932313230303332342e3435355a");

      const value = AsnGeneralizedTimeConverter.fromASN(asn);
      expect(value.getTime()).toBe(dateNum);
    });
  });

  describe("UTCTime", () => {
    const dateNum = 1537560204000;
    it("correct", () => {
      const asn = AsnUTCTimeConverter.toASN(new Date(dateNum));

      const der = asn.toBER();
      expect(Buffer.from(der).toString("hex")).toBe("170d3138303932313230303332345a");

      const value = AsnUTCTimeConverter.fromASN(asn);
      expect(value.getTime()).toBe(dateNum);
    });
  });

  describe("ConstructedOctetStringConverter", () => {
    const buffer = Buffer.from("12345", "ascii");
    it("correct", () => {
      const asn = AsnConstructedOctetStringConverter.toASN(new OctetString(buffer));

      const der = asn.toBER();
      expect(Buffer.from(der).toString("hex")).toBe("04053132333435");

      const value = AsnConstructedOctetStringConverter.fromASN(asn);
      expect(Buffer.from(value.buffer)).not.toBe(buffer);
    });
  });
});

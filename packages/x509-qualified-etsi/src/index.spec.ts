import { describe, expect, it } from "vitest";
import { AsnConvert } from "@peculiar/asn1-schema";
import * as etsi from "./index";

describe("x509-qualified-etsi", () => {
  describe("QcCClegislation", () => {
    it("serialize/parse", () => {
      const qc = new etsi.QcCClegislation(["UK", "GR"]);
      const raw = AsnConvert.serialize(qc);
      /**
       * SEQUENCE (2 elem)
       *   PrintableString UK
       *   PrintableString GR
       */
      expect(Buffer.from(raw).toString("hex")).toBe("30081302554b13024752");

      const test = AsnConvert.parse(raw, etsi.QcCClegislation);
      expect(test).toStrictEqual(qc);
    });
  });

  describe("QcEuLimitValue", () => {
    it("serialize/parse", () => {
      const qc = new etsi.QcEuLimitValue({
        amount: 1,
        exponent: 2,
        currency: new etsi.Iso4217CurrencyCode("abc"),
      });
      const raw = AsnConvert.serialize(qc);
      /**
       * SEQUENCE (3 elem)
       *   PrintableString abc
       *   INTEGER 1
       *   INTEGER 2
       */
      expect(Buffer.from(raw).toString("hex")).toBe("300b1303616263020101020102");

      const test = AsnConvert.parse(raw, etsi.QcEuLimitValue);
      expect(test).toStrictEqual(qc);
    });
  });

  describe("QcEuPDS", () => {
    it("serialize/parse", () => {
      const qc = new etsi.QcEuPDS([
        new etsi.PdsLocation({
          language: "en",
          url: "http://some.url",
        }),
      ]);
      const raw = AsnConvert.serialize(qc);
      /**
       * SEQUENCE (1 elem)
       *   SEQUENCE (2 elem)
       *     IA5String http://some.url
       *     PrintableString en
       */
      expect(Buffer.from(raw).toString("hex")).toBe("30173015160f687474703a2f2f736f6d652e75726c1302656e");

      const test = AsnConvert.parse(raw, etsi.QcEuPDS);
      expect(test).toStrictEqual(qc);
    });
  });

  describe("QcEuRetentionPeriod", () => {
    it("serialize/parse", () => {
      const qc = new etsi.QcEuRetentionPeriod(1);
      const raw = AsnConvert.serialize(qc);
      /**
       * INTEGER 1
       */
      expect(Buffer.from(raw).toString("hex")).toBe("020101");

      const test = AsnConvert.parse(raw, etsi.QcEuRetentionPeriod);
      expect(test).toStrictEqual(qc);
    });
  });

  describe("QcType", () => {
    it("serialize/parse", () => {
      const qc = new etsi.QcType([etsi.id_etsi_qct_esign, etsi.id_etsi_qct_eseal, etsi.id_etsi_qct_web]);
      const raw = AsnConvert.serialize(qc);
      /**
       * SEQUENCE (3 elem)
       *   OBJECT IDENTIFIER 0.4.0.1862.1.6.1
       *   OBJECT IDENTIFIER 0.4.0.1862.1.6.2
       *   OBJECT IDENTIFIER 0.4.0.1862.1.6.3
       */
      expect(Buffer.from(raw).toString("hex")).toBe("301b060704008e46010601060704008e46010602060704008e46010603");

      const test = AsnConvert.parse(raw, etsi.QcType);
      expect(test).toStrictEqual(qc);
    });
  });
});

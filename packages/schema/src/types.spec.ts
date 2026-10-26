import { describe, expect, it } from "vitest";
import { hex } from "@peculiar/utils/encoding";
import { BitString, AsnConvert } from "./index";

describe("asn1-schema", () => {
  describe("BitString", () => {
    describe("ArrayBuffer", () => {
      const hexString = "030403010203";

      it("serialize", () => {
        const obj = new BitString(new Uint8Array([1, 2, 3]), 3);
        const der = AsnConvert.serialize(obj);

        expect(hex.encode(der)).toBe(hexString);
      });

      it("parse", () => {
        const obj = AsnConvert.parse(hex.decode(hexString), BitString);

        expect(obj.unusedBits).toBe(3);
        expect(hex.encode(obj.value)).toBe("010203");
      });
    });

    describe("Number", () => {
      const hexString = "0303074080";
      const num = 256 | 2;

      it("serialize", () => {
        const obj = new BitString(num);
        const der = AsnConvert.serialize(obj);

        expect(hex.encode(der)).toBe(hexString);
      });

      it("parse", () => {
        const obj = AsnConvert.parse(hex.decode(hexString), BitString);

        expect(obj.unusedBits).toBe(7);
        expect(obj.toNumber()).toBe(num);
      });

      it("parse #2", () => {
        const obj = AsnConvert.parse(hex.decode("03030740ff"), BitString);

        expect(obj.unusedBits).toBe(7);
        expect(obj.toNumber()).toBe(num);
      });
    });
  });
});

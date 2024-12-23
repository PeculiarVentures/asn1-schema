import * as assert from "node:assert";
import { BitString, AsnConvert } from "../src";
import { Convert } from "pvtsutils";

describe("asn1-schema", () => {
  describe("BitString", () => {
    describe("ArrayBuffer", () => {
      const hex = "030403010203";

      it("serialize", () => {
        const obj = new BitString(new Uint8Array([1, 2, 3]), 3);
        const der = AsnConvert.serialize(obj);

        assert.strictEqual(Convert.ToHex(der), hex);
      });

      it("parse", () => {
        const obj = AsnConvert.parse(Convert.FromHex(hex), BitString);

        assert.strictEqual(obj.unusedBits, 3);
        assert.strictEqual(Convert.ToHex(obj.value), "010203");
      });
    });

    describe("Number", () => {
      const hex = "0303074080";
      const num = 256 | 2;

      it("serialize", () => {
        const obj = new BitString(num);
        const der = AsnConvert.serialize(obj);

        assert.strictEqual(Convert.ToHex(der), hex);
      });

      it("parse", () => {
        const obj = AsnConvert.parse(Convert.FromHex(hex), BitString);

        assert.strictEqual(obj.unusedBits, 7);
        assert.strictEqual(obj.toNumber(), num);
      });

      it("parse #2", () => {
        const obj = AsnConvert.parse(Convert.FromHex("03030740ff"), BitString);

        assert.strictEqual(obj.unusedBits, 7);
        assert.strictEqual(obj.toNumber(), num);
      });
    });
  });
});

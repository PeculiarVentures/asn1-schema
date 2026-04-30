import * as assert from "node:assert";
import { hex } from "@peculiar/utils/encoding";
import { BitString, AsnConvert } from "../src";

describe("asn1-schema", () => {
  describe("BitString", () => {
    describe("ArrayBuffer", () => {
      const hexString = "030403010203";

      it("serialize", () => {
        const obj = new BitString(new Uint8Array([1, 2, 3]), 3);
        const der = AsnConvert.serialize(obj);

        assert.strictEqual(hex.encode(der), hexString);
      });

      it("parse", () => {
        const obj = AsnConvert.parse(hex.decode(hexString), BitString);

        assert.strictEqual(obj.unusedBits, 3);
        assert.strictEqual(hex.encode(obj.value), "010203");
      });
    });

    describe("Number", () => {
      const hexString = "0303074080";
      const num = 256 | 2;

      it("serialize", () => {
        const obj = new BitString(num);
        const der = AsnConvert.serialize(obj);

        assert.strictEqual(hex.encode(der), hexString);
      });

      it("parse", () => {
        const obj = AsnConvert.parse(hex.decode(hexString), BitString);

        assert.strictEqual(obj.unusedBits, 7);
        assert.strictEqual(obj.toNumber(), num);
      });

      it("parse #2", () => {
        const obj = AsnConvert.parse(hex.decode("03030740ff"), BitString);

        assert.strictEqual(obj.unusedBits, 7);
        assert.strictEqual(obj.toNumber(), num);
      });
    });
  });
});

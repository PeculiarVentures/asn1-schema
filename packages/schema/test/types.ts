import * as assert from "assert";
import { BitString, AsnConvert } from "../src";
import { Convert } from "pvtsutils";

context("asn1-schema", () => {

  context("BitString", () => {

    context(("ArrayBuffer"), () => {

      const hex = "030403010203";

      it("serialize", () => {
        const obj = new BitString(new Uint8Array([1, 2, 3]), 3);
        const der = AsnConvert.serialize(obj);

        assert.equal(Convert.ToHex(der), hex);
      });

      it("parse", () => {
        const obj = AsnConvert.parse(Convert.FromHex(hex), BitString);

        assert.equal(obj.unusedBits, 3);
        assert.equal(Convert.ToHex(obj.value), "010203");
      });

    });

    context(("Number"), () => {

      const hex = "0303074080";
      const num = 256 | 2;

      it("serialize", () => {
        const obj = new BitString(num);
        const der = AsnConvert.serialize(obj);

        assert.equal(Convert.ToHex(der), hex);
      });

      it("parse", () => {
        const obj = AsnConvert.parse(Convert.FromHex(hex), BitString);

        assert.equal(obj.unusedBits, 7);
        assert.equal(obj.toNumber(), num);
      });

      it("parse #2", () => {
        const obj = AsnConvert.parse(Convert.FromHex("03030740ff"), BitString);

        assert.equal(obj.unusedBits, 7);
        assert.equal(obj.toNumber(), num);
      });

    });

  });

});

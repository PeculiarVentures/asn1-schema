import { AsnConvert } from "@peculiar/asn1-schema";
import * as assert from "assert";
import { TNAuthorizationList } from "../src";

context("RFC8266", () => {

  context("TNAuthorizationList", () => {

    it("spc", () => {
      const hex = "3008a00616043730394a";

      const ext = AsnConvert.parse(Buffer.from(hex, "hex"), TNAuthorizationList);
      assert.strictEqual(ext.length, 1);
      assert.strictEqual(ext[0].spc, "709J");

      const raw = AsnConvert.serialize(ext);
      assert.strictEqual(Buffer.from(raw).toString("hex"), hex);
    });

  });

});

import * as assert from "node:assert";
import { AsnConvert } from "@peculiar/asn1-schema";
import { Timestamp, Version } from "../src";

describe("adobe-acrobat", () => {
  describe("Timestamp", () => {
    it("parse", () => {
      const hex =
        "304c0201018644687474703a2f2f6161746c2d74696d657374616d702e676c6f62616c7369676e2e636f6d2f7473612f616f68666577617432333839353335666e6173676e6c67356d3233010100";

      const timestamp = AsnConvert.parse(Buffer.from(hex, "hex"), Timestamp);
      assert.strictEqual(timestamp.version, Version.v1);
      assert.strictEqual(
        timestamp.location.uniformResourceIdentifier,
        "http://aatl-timestamp.globalsign.com/tsa/aohfewat2389535fnasgnlg5m23",
      );
      assert.strictEqual(timestamp.requiresAuth, false);
    });
  });
});

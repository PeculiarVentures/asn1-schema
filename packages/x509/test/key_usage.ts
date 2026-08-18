import { KeyUsage, KeyUsageFlags } from "../src/extensions/key_usage";
import * as assert from "node:assert";

describe("KeyUsage", () => {
  describe("toJSON", () => {
    it("Should return an empty array when no flags are set", () => {
      const ku = new KeyUsage(0);
      assert.deepStrictEqual(ku.toJSON(), []);
    });

    it("Should return ['digitalSignature'] for digitalSignature flag", () => {
      const ku = new KeyUsage(KeyUsageFlags.digitalSignature);
      assert.deepStrictEqual(ku.toJSON(), ["digitalSignature"]);
    });

    it("Should return ['nonRepudiation'] for nonRepudiation flag", () => {
      const ku = new KeyUsage(KeyUsageFlags.nonRepudiation);
      assert.deepStrictEqual(ku.toJSON(), ["nonRepudiation"]);
    });

    it("Should return ['keyEncipherment'] for keyEncipherment flag", () => {
      const ku = new KeyUsage(KeyUsageFlags.keyEncipherment);
      assert.deepStrictEqual(ku.toJSON(), ["keyEncipherment"]);
    });

    it("Should return ['dataEncipherment'] for dataEncipherment flag", () => {
      const ku = new KeyUsage(KeyUsageFlags.dataEncipherment);
      assert.deepStrictEqual(ku.toJSON(), ["dataEncipherment"]);
    });

    it("Should return ['keyAgreement'] for keyAgreement flag", () => {
      const ku = new KeyUsage(KeyUsageFlags.keyAgreement);
      assert.deepStrictEqual(ku.toJSON(), ["keyAgreement"]);
    });

    it("Should return ['keyCertSign'] for keyCertSign flag", () => {
      const ku = new KeyUsage(KeyUsageFlags.keyCertSign);
      assert.deepStrictEqual(ku.toJSON(), ["keyCertSign"]);
    });

    it("Should return ['cRLSign'] for cRLSign flag", () => {
      const ku = new KeyUsage(KeyUsageFlags.cRLSign);
      assert.deepStrictEqual(ku.toJSON(), ["cRLSign"]);
    });

    it("Should return ['encipherOnly'] for encipherOnly flag", () => {
      const ku = new KeyUsage(KeyUsageFlags.encipherOnly);
      assert.deepStrictEqual(ku.toJSON(), ["encipherOnly"]);
    });

    it("Should return ['decipherOnly'] for decipherOnly flag", () => {
      const ku = new KeyUsage(KeyUsageFlags.decipherOnly);
      assert.deepStrictEqual(ku.toJSON(), ["decipherOnly"]);
    });

    it("Should return multiple flags when combined", () => {
      const ku = new KeyUsage(
        KeyUsageFlags.digitalSignature
        | KeyUsageFlags.keyCertSign
        | KeyUsageFlags.cRLSign,
      );
      assert.deepStrictEqual(ku.toJSON(), ["cRLSign", "digitalSignature", "keyCertSign"]);
    });

    it("Should return all flags when all bits are set", () => {
      const allFlags =
        KeyUsageFlags.digitalSignature
        | KeyUsageFlags.nonRepudiation
        | KeyUsageFlags.keyEncipherment
        | KeyUsageFlags.dataEncipherment
        | KeyUsageFlags.keyAgreement
        | KeyUsageFlags.keyCertSign
        | KeyUsageFlags.cRLSign
        | KeyUsageFlags.encipherOnly
        | KeyUsageFlags.decipherOnly;
      const ku = new KeyUsage(allFlags);

      assert.deepStrictEqual(ku.toJSON(), [
        "cRLSign",
        "dataEncipherment",
        "decipherOnly",
        "digitalSignature",
        "encipherOnly",
        "keyAgreement",
        "keyCertSign",
        "keyEncipherment",
        "nonRepudiation",
      ]);
    });
  });

  describe("toString", () => {
    it("Should return formatted string with flag names", () => {
      const ku = new KeyUsage(
        KeyUsageFlags.keyAgreement
        | KeyUsageFlags.encipherOnly
        | KeyUsageFlags.decipherOnly,
      );

      assert.strictEqual(ku.toString(), "[decipherOnly, encipherOnly, keyAgreement]");
    });

    it("Should return empty brackets when no flags are set", () => {
      const ku = new KeyUsage(0);

      assert.strictEqual(ku.toString(), "[]");
    });
  });
});

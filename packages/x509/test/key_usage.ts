import { KeyUsage, KeyUsageFlags } from "../src/extensions/key_usage";
import * as assert from "node:assert";

describe("KeyUsage", () => {
  describe("toJSON", () => {
    it("Should return an empty array when no flags are set", () => {
      const keyUsage = new KeyUsage(0);

      assert.deepStrictEqual(keyUsage.toJSON(), []);
    });

    it("Should return ['digitalSignature'] for digitalSignature flag", () => {
      const keyUsage = new KeyUsage(KeyUsageFlags.digitalSignature);

      assert.deepStrictEqual(keyUsage.toJSON(), ["digitalSignature"]);
    });

    it("Should return ['nonRepudiation'] for nonRepudiation flag", () => {
      const keyUsage = new KeyUsage(KeyUsageFlags.nonRepudiation);

      assert.deepStrictEqual(keyUsage.toJSON(), ["nonRepudiation"]);
    });

    it("Should return ['keyEncipherment'] for keyEncipherment flag", () => {
      const keyUsage = new KeyUsage(KeyUsageFlags.keyEncipherment);

      assert.deepStrictEqual(keyUsage.toJSON(), ["keyEncipherment"]);
    });

    it("Should return ['dataEncipherment'] for dataEncipherment flag", () => {
      const keyUsage = new KeyUsage(KeyUsageFlags.dataEncipherment);

      assert.deepStrictEqual(keyUsage.toJSON(), ["dataEncipherment"]);
    });

    it("Should return ['keyAgreement'] for keyAgreement flag", () => {
      const keyUsage = new KeyUsage(KeyUsageFlags.keyAgreement);

      assert.deepStrictEqual(keyUsage.toJSON(), ["keyAgreement"]);
    });

    it("Should return ['keyCertSign'] for keyCertSign flag", () => {
      const keyUsage = new KeyUsage(KeyUsageFlags.keyCertSign);

      assert.deepStrictEqual(keyUsage.toJSON(), ["keyCertSign"]);
    });

    it("Should return ['cRLSign'] for cRLSign flag", () => {
      const keyUsage = new KeyUsage(KeyUsageFlags.cRLSign);

      assert.deepStrictEqual(keyUsage.toJSON(), ["cRLSign"]);
    });

    it("Should return ['encipherOnly'] for encipherOnly flag", () => {
      const keyUsage = new KeyUsage(KeyUsageFlags.encipherOnly);

      assert.deepStrictEqual(keyUsage.toJSON(), ["encipherOnly"]);
    });

    it("Should return ['decipherOnly'] for decipherOnly flag", () => {
      const keyUsage = new KeyUsage(KeyUsageFlags.decipherOnly);

      assert.deepStrictEqual(keyUsage.toJSON(), ["decipherOnly"]);
    });

    it("Should return multiple flags when combined", () => {
      const keyUsage = new KeyUsage(KeyUsageFlags.digitalSignature | KeyUsageFlags.keyCertSign | KeyUsageFlags.cRLSign);

      assert.deepStrictEqual(keyUsage.toJSON(), ["cRLSign", "digitalSignature", "keyCertSign"]);
    });

    it("Should return all flags when all bits are set", () => {
      const allFlags =
        KeyUsageFlags.digitalSignature |
        KeyUsageFlags.nonRepudiation |
        KeyUsageFlags.keyEncipherment |
        KeyUsageFlags.dataEncipherment |
        KeyUsageFlags.keyAgreement |
        KeyUsageFlags.keyCertSign |
        KeyUsageFlags.cRLSign |
        KeyUsageFlags.encipherOnly |
        KeyUsageFlags.decipherOnly;
      const keyUsage = new KeyUsage(allFlags);

      assert.deepStrictEqual(keyUsage.toJSON(), [
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
      const keyUsage = new KeyUsage(KeyUsageFlags.keyAgreement | KeyUsageFlags.encipherOnly | KeyUsageFlags.decipherOnly);

      assert.strictEqual(keyUsage.toString(), "[decipherOnly, encipherOnly, keyAgreement]");
    });

    it("Should return empty brackets when no flags are set", () => {
      const keyUsage = new KeyUsage(0);

      assert.strictEqual(keyUsage.toString(), "[]");
    });
  });
});

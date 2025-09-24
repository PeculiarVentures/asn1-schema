import { describe, it, assert } from "vitest";
import * as src from "../src";
import { AsnConvert } from "@peculiar/asn1-schema";

describe("ECC algorithms", () => {
  it("ECDSA with SHA-1", () => {
    const raw = AsnConvert.serialize(src.ecdsaWithSHA1);

    const hex = Buffer.from(raw).toString("hex");
    assert.strictEqual(hex, "300906072a8648ce3d0401");
  });

  it("ECDSA with SHA-224", () => {
    const raw = AsnConvert.serialize(src.ecdsaWithSHA224);

    const hex = Buffer.from(raw).toString("hex");
    assert.strictEqual(hex, "300a06082a8648ce3d040301");
  });

  it("ECDSA with SHA-256", () => {
    const raw = AsnConvert.serialize(src.ecdsaWithSHA256);

    const hex = Buffer.from(raw).toString("hex");
    assert.strictEqual(hex, "300a06082a8648ce3d040302");
  });

  it("ECDSA with SHA-384", () => {
    const raw = AsnConvert.serialize(src.ecdsaWithSHA384);

    const hex = Buffer.from(raw).toString("hex");
    assert.strictEqual(hex, "300a06082a8648ce3d040303");
  });

  it("ECDSA with SHA-512", () => {
    const raw = AsnConvert.serialize(src.ecdsaWithSHA512);

    const hex = Buffer.from(raw).toString("hex");
    assert.strictEqual(hex, "300a06082a8648ce3d040304");
  });
});

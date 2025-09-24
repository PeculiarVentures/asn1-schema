import { describe, it, assert } from "vitest";
import { AsnConvert } from "@peculiar/asn1-schema";
import { ECDSASigValue } from "../src/ec_signature_value";

describe("EcDsaSignatureValue", () => {
  it("parse", () => {
    const raw = Buffer.from(
      "3046022100984a8a53f4f540950423bdf0d3ad12f413f41bef65c672ff76fa74c8d71d11ff022100954d2a9f138ae22c12467cccb12b7e4b2380c70ad515710f747aaeea1c8cd647",
      "hex",
    );

    const sig = AsnConvert.parse(raw, ECDSASigValue);

    assert.strictEqual(
      Buffer.from(sig.r).toString("hex"),
      "00984a8a53f4f540950423bdf0d3ad12f413f41bef65c672ff76fa74c8d71d11ff",
    );
    assert.strictEqual(
      Buffer.from(sig.s).toString("hex"),
      "00954d2a9f138ae22c12467cccb12b7e4b2380c70ad515710f747aaeea1c8cd647",
    );
  });
});

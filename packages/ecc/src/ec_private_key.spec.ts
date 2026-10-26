import { describe, expect, it } from "vitest";
import { AsnConvert, OctetString } from "@peculiar/asn1-schema";
import { ECParameters, id_secp256r1, ECPrivateKey } from "./index";

describe("EC Private Key", () => {
  const privateKeyHex = "301f020101040400800001a00a06082a8648ce3d030107a1080306000080000002";

  it("serialize", () => {
    const privateKey = new ECPrivateKey({
      privateKey: new OctetString([0, 128, 0, 1]),
      parameters: new ECParameters({ namedCurve: id_secp256r1 }),
      publicKey: new Uint8Array([0, 128, 0, 0, 2]).buffer,
    });
    const der = AsnConvert.serialize(privateKey);
    expect(Buffer.from(der).toString("hex")).toBe(privateKeyHex);
  });

  it("parse", () => {
    const privateKey = AsnConvert.parse(Buffer.from(privateKeyHex, "hex"), ECPrivateKey);
    expect(privateKey.version).toBe(1);
    expect(privateKey.privateKey.byteLength).toBe(4);
    expect(privateKey.parameters?.namedCurve).toBe(id_secp256r1);
    expect(privateKey.publicKey?.byteLength).toBe(5);
  });
});

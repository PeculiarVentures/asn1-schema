import * as assert from "node:assert";
import { ECParameters, id_secp256r1, ECPrivateKey } from "../src";
import { AsnConvert, OctetString } from "@peculiar/asn1-schema";

describe("EC Private Key", () => {
  const privateKeyHex = "301f020101040400800001a00a06082a8648ce3d030107a1080306000080000002";

  it("serialize", () => {
    const privateKey = new ECPrivateKey({
      privateKey: new OctetString([0, 128, 0, 1]),
      parameters: new ECParameters({ namedCurve: id_secp256r1 }),
      publicKey: new Uint8Array([0, 128, 0, 0, 2]).buffer,
    });
    const der = AsnConvert.serialize(privateKey);
    assert.strictEqual(Buffer.from(der).toString("hex"), privateKeyHex);
  });

  it("parse", () => {
    const privateKey = AsnConvert.parse(Buffer.from(privateKeyHex, "hex"), ECPrivateKey);
    assert.strictEqual(privateKey.version, 1);
    assert.strictEqual(privateKey.privateKey.byteLength, 4);
    assert.strictEqual(privateKey.parameters?.namedCurve, id_secp256r1);
    assert.strictEqual(privateKey.publicKey?.byteLength, 5);
  });
});

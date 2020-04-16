import * as assert from "assert";
import { ECParameters, id_secp256r1, ECPrivateKey } from "../src";
import { AsnConvert } from "@peculiar/asn1-schema";

context("EC Private Key", () => {

  const privateKeyHex = "301f020101040400800001a00a06082a8648ce3d030107a1080306000080000002";

  it("serialize", () => {
    const privateKey = new ECPrivateKey({
      privateKey: new Uint8Array([0, 128, 0, 1]).buffer,
      parameters: new ECParameters({ namedCurve: id_secp256r1 }),
      publicKey: new Uint8Array([0, 128, 0, 0, 2]).buffer,
    })
    const der = AsnConvert.serialize(privateKey);
    assert.equal(Buffer.from(der).toString("hex"), privateKeyHex);
  });

  it("parse", () => {
    const privateKey = AsnConvert.parse(Buffer.from(privateKeyHex, "hex"), ECPrivateKey);
    assert.equal(privateKey.version, 1);
    assert.equal(privateKey.privateKey.byteLength, 4);
    assert.equal(privateKey.parameters?.namedCurve, id_secp256r1);
    assert.equal(privateKey.publicKey?.byteLength, 5);
  });

});
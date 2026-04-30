import * as assert from "node:assert";
import { AlgorithmIdentifier } from "@peculiar/asn1-x509";
import { AsnConvert, OctetString } from "@peculiar/asn1-schema";
import { EncryptedPrivateKeyInfo } from "../src";

describe("PrivateKeyInfo", () => {
  const hex = "300f300806042a03040505000403800001";

  it("serialize", () => {
    const obj = new EncryptedPrivateKeyInfo({
      encryptionAlgorithm: new AlgorithmIdentifier({
        algorithm: "1.2.3.4.5",
        parameters: null,
      }),
      encryptedData: new OctetString([128, 0, 1]),
    });

    const der = AsnConvert.serialize(obj);
    assert.strictEqual(Buffer.from(der).toString("hex"), hex);
  });

  it("parse", () => {
    const obj = AsnConvert.parse(Buffer.from(hex, "hex"), EncryptedPrivateKeyInfo);
    assert.strictEqual(obj.encryptionAlgorithm.algorithm, "1.2.3.4.5");
    assert.strictEqual(obj.encryptedData.byteLength, 3);
  });
});

import * as assert from "assert";
import { PrivateKeyInfo, Attributes } from "../src";
import { AlgorithmIdentifier, Attribute } from "@peculiar/asn1-x509";
import { AsnConvert, AsnOctetStringConverter, OctetString } from "@peculiar/asn1-schema";

context("PrivateKeyInfo", () => {
  const hex = "3022020100300806042a03040505000403800001a00e300c060353040531050403800002";

  it("serialize", () => {
    const obj = new PrivateKeyInfo({
      privateKeyAlgorithm: new AlgorithmIdentifier({
        algorithm: "1.2.3.4.5",
        parameters: null,
      }),
      privateKey: new OctetString([128, 0, 1]),
      attributes: new Attributes([
        new Attribute({
          type: "2.3.4.5",
          values: [
            AsnConvert.serialize(AsnOctetStringConverter.toASN(new Uint8Array([128, 0, 2]).buffer)),
          ],
        }),
      ]),
    });

    const der = AsnConvert.serialize(obj);
    assert.strictEqual(Buffer.from(der).toString("hex"), hex);
  });

  it("parse", () => {
    const obj = AsnConvert.parse(Buffer.from(hex, "hex"), PrivateKeyInfo);
    assert.strictEqual(obj.version, 0);
    assert.strictEqual(obj.privateKeyAlgorithm.algorithm, "1.2.3.4.5");
    assert.strictEqual(obj.privateKey.byteLength, 3);
    assert.strictEqual(obj.attributes?.length, 1);
  });
});

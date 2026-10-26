import { describe, expect, it } from "vitest";
import { AlgorithmIdentifier } from "@peculiar/asn1-x509";
import { AsnConvert, OctetString } from "@peculiar/asn1-schema";
import { EncryptedPrivateKeyInfo } from "./index";

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
    expect(Buffer.from(der).toString("hex")).toBe(hex);
  });

  it("parse", () => {
    const obj = AsnConvert.parse(Buffer.from(hex, "hex"), EncryptedPrivateKeyInfo);
    expect(obj.encryptionAlgorithm.algorithm).toBe("1.2.3.4.5");
    expect(obj.encryptedData.byteLength).toBe(3);
  });
});

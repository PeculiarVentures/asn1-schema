import { describe, it, assert } from "vitest";
import { AsnConvert } from "@peculiar/asn1-schema";
import { CertificateTransparency } from "../src";

describe("cert-transparency", () => {
  describe("CertificateTransparency", () => {
    it("parse", () => {
      const hex =
        "0481f200f0007600bbd9dfbc1f8a71b593942397aa927b473857950aab52e81a909664368e1ed18500000170ac4b55f8000004030047304502206f7acb0532ea7ebf8ac7bc6db361e9b945d99406ad995c0d50ddd1b0326c5781022100deef6adaa4c33ca25b8a09dbdc028f13faeaa18a5fada7bf065037afa4f8cfb90076005614069a2fd7c2ecd3f5e1bd44b23ec74676b9bc99115cc0ef949855d689d0dd00000170ac4b564a0000040300473045022100963c275d34cf37ab3fc249a25b1197b4a3968359a5baea1bbb2ef1c1d9f06bb102204a58c43591b68d3f20bdbd6b87c62ce186421af4a6c4039451d07280b7b25573";
      const ext = AsnConvert.parse(Buffer.from(hex, "hex"), CertificateTransparency);

      assert.strictEqual(ext.items.length, 2);
    });
  });
});

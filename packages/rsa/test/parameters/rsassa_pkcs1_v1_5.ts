import * as assert from "assert";
import { AsnConvert, OctetString } from "@peculiar/asn1-schema";
import { DigestInfo, sha1, id_sha1 } from "../../src";

context("RSASSA PKCS v1.5", () => {

  context("DigestInfo", () => {
    
    const digestInfoHex = "3021300906052b0e03021a05000414da39a3ee5e6b4b0d3255bfef95601890afd80709";

    it("serialize", () => {
      const publicKey = new DigestInfo({
        digestAlgorithm: sha1,
        digest: new OctetString([0xda, 0x39, 0xa3, 0xee, 0x5e, 0x6b, 0x4b, 0x0d, 0x32, 0x55, 0xbf, 0xef, 0x95, 0x60, 0x18, 0x90, 0xaf, 0xd8, 0x07, 0x09]),
      })

      const der = AsnConvert.serialize(publicKey);

      // SEQUENCE (2 elem)
      //   SEQUENCE (2 elem)
      //     OBJECT IDENTIFIER 1.3.14.3.2.26 sha1 (OIW)
      //     NULL
      //   OCTET STRING (20 byte) DA39A3EE5E6B4B0D3255BFEF95601890AFD80709
      const hex = Buffer.from(der).toString("hex");
      assert.strictEqual(hex, digestInfoHex);
    });

    it("parse", () => {
      const der = Buffer.from(digestInfoHex, "hex");

      const digestInfo = AsnConvert.parse(der, DigestInfo);
      assert.strictEqual(digestInfo.digestAlgorithm.algorithm, id_sha1);
      assert.strictEqual(digestInfo.digest.byteLength, 20);
    });
  });
});
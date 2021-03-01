import * as assert from "assert";
import { AsnConvert } from "@peculiar/asn1-schema";
import { CaVersion } from "../src/attributes/extensions/ca_version";
import { EnrollCertTypeChoice } from "../src/attributes";

context("Microsoft X509", () => {

  context("CaVersion", () => {

    context("parse", () => {
      const vectors: { [key: string]: Uint8Array; } = {
        "V0.0": new Uint8Array([0x02, 0x01, 0x00]),
        "V2.0": new Uint8Array([0x02, 0x01, 0x02]),
        "V10.0": new Uint8Array([0x02, 0x01, 0x0a]),
        "V255.0": new Uint8Array([0x02, 0x01, 0xff]),
        "V1.0": new Uint8Array([0x02, 0x03, 0x00, 0x00, 0x01]),
        "V2.2": new Uint8Array([0x02, 0x03, 0x02, 0x00, 0x02]),
        "V255.127": new Uint8Array([0x02, 0x03, 0x7f, 0x00, 0xff]),
        "V255.128": new Uint8Array([0x02, 0x04, 0x00, 0x80, 0x00, 0xff]),
        "V255.255": new Uint8Array([0x02, 0x04, 0x00, 0xff, 0x00, 0xff]),
        "V256.256": new Uint8Array([0x02, 0x04, 0x01, 0x00, 0x01, 0x00]),
        "V300.300": new Uint8Array([0x02, 0x04, 0x01, 0x2c, 0x01, 0x2c]),
        "V1000.750": new Uint8Array([0x02, 0x04, 0x02, 0xee, 0x03, 0xe8]),
      };
      for (const key in vectors) {
        it(key, () => {
          const caVersion = AsnConvert.parse(vectors[key], CaVersion);
          assert.strictEqual(caVersion.toString(), key);
        });
      }
    });
  });

  context("EnrollCertType", () => {

    it("BMPString", () => {
      const hex = `1E0A00530075006200430041`;
      const enrollCertType = AsnConvert.parse(Buffer.from(hex, "hex"), EnrollCertTypeChoice);
      assert.strictEqual(enrollCertType.toString(), "SubCA");
      console.log(enrollCertType);
    });

    it("UTF8String", () => {
      const hex = `0C086365727454797065`;
      const enrollCertType = AsnConvert.parse(Buffer.from(hex, "hex"), EnrollCertTypeChoice);
      assert.strictEqual(enrollCertType.toString(), "certType");
      console.log(enrollCertType);
    });

  });

});


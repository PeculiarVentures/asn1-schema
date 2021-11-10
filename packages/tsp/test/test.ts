import { AsnConvert, OctetString } from "@peculiar/asn1-schema";
import { AlgorithmIdentifier, Extension, Extensions, id_ce_keyUsage, KeyUsage, KeyUsageFlags } from "@peculiar/asn1-x509";
import * as assert from "assert";
import * as src from "../src";

context("TSP", () => {

  it("parse TSTInfo", () => {
    const hex = "30820113060B2A864886F70D0109100104A08201020481FF3081FC02010106032901013021300906052B0E03021A0500041495811474539B0D71C20A2107FBACCDCBCD53A8AC021401E023B628463246E5488B0C3F04B9A3503E2E2B180F32303137303232333039353930345AA081A7A481A43081A131819E30090603550406130255533025060355040B1E1E0054005300500020005400650073007400200053006500720076006500723029060355040A1E220050006500630075006C006900610072002000560065006E00740075007200650073303F06035504031E380050006500630075006C006900610072002000560065006E0074007500720065007300200054005300500020005300650072007600650072";
    const raw = Buffer.from(hex, "hex");

    const contentInfo = AsnConvert.parse(raw, src.TimeStampToken);
    assert.strictEqual(contentInfo.contentType, src.id_ct_tstInfo);

    const content = AsnConvert.parse(contentInfo.content, OctetString);
    const tstInfo = AsnConvert.parse(content, src.TSTInfo);

    assert.strictEqual(tstInfo.version, src.TSTInfoVersion.v1);
    assert.strictEqual(tstInfo.policy, "1.1.1.1");
    assert.strictEqual(tstInfo.messageImprint.hashAlgorithm.algorithm, "1.3.14.3.2.26");
    assert.strictEqual(tstInfo.messageImprint.hashAlgorithm.parameters, null);
    assert.strictEqual(Buffer.from(tstInfo.messageImprint.hashedMessage.buffer).toString("hex"), "95811474539b0d71c20a2107fbaccdcbcd53a8ac");
    assert.strictEqual(Buffer.from(tstInfo.serialNumber).toString("hex"), "01e023b628463246e5488b0c3f04b9a3503e2e2b");
    assert(tstInfo.genTime);
    assert.strictEqual(tstInfo.ordering, false);
    assert(tstInfo.tsa);
  });

  it("create TSP request", () => {
    const req = new src.TimeStampReq({
      messageImprint: new src.MessageImprint({
        hashAlgorithm: new AlgorithmIdentifier({
          algorithm: "1.3.14.3.2.26",
          parameters: null,
        }),
        hashedMessage: new OctetString(new Uint8Array(20)),
      }),
      reqPolicy: "1.1.1.1",
      nonce: new Uint8Array(16).buffer,
      certReq: true,
      extensions: new Extensions([
        new Extension({
          extnID: id_ce_keyUsage,
          extnValue: new OctetString(AsnConvert.serialize(new KeyUsage(KeyUsageFlags.keyCertSign | KeyUsageFlags.keyAgreement))),
        }),
      ]),
    });

    const raw = AsnConvert.serialize(req);

    // SEQUENCE (6 elem)
    //   INTEGER 1
    //   SEQUENCE (2 elem)
    //     SEQUENCE (2 elem)
    //       OBJECT IDENTIFIER 1.3.14.3.2.26 sha1 (OIW)
    //       NULL
    //     OCTET STRING (20 byte) 0000000000000000000000000000000000000000
    //   OBJECT IDENTIFIER 1.1.1.1
    //   INTEGER 0
    //   BOOLEAN true
    //   [0] (1 elem)
    //     SEQUENCE (2 elem)
    //       OBJECT IDENTIFIER 2.5.29.15 keyUsage (X.509 extension)
    //       OCTET STRING (4 byte) 0302020C
    //         BIT STRING (6 bit) 000011
    assert.strictEqual(Buffer.from(raw).toString("hex"), "304f0201013021300906052b0e03021a05000414000000000000000000000000000000000000000006032901010210000000000000000000000000000000000101ffa00d300b0603551d0f04040302020c");
  });

  it("create TSP response", () => {
    const resp = new src.TimeStampResp({
      status: new src.PKIStatusInfo({
        failInfo: new src.PKIFailureInfo(src.PKIFailureInfoFlags.badDataFormat),
        status: src.PKIStatus.rejection,
        statusString: new src.PKIFreeText([
          "text 1",
          "text 2",
        ]),
      })
    });

    const raw = AsnConvert.serialize(resp);

    // SEQUENCE (1 elem)
    //   SEQUENCE (3 elem)
    //     INTEGER 2
    //     SEQUENCE (2 elem)
    //       UTF8String text 1
    //       UTF8String text 2
    //     BIT STRING (5 bit) 00001
    assert.strictEqual(Buffer.from(raw).toString("hex"), "301b301902010230100c067465787420310c0674657874203203020308");
  });

});

import * as assert from "assert";
import { AsnParser, AsnSerializer, OctetString } from "@peculiar/asn1-schema";
import { Convert } from "pvtsutils";
import { OCSPRequest, TBSRequest, CertID, Request } from "../src";
import { GeneralName, AlgorithmIdentifier } from "@peculiar/asn1-x509";
import * as fs from "fs";

context("ocsp", () => {
  it("request", () => {
    const hex = "3060305ea122a420301e311c3009060355040613025255300f06035504031e080054006500730074301f301d301b300706052b0e03021a04047f01020304047f01020302047f010203a2173015301306092b0601050507300102040604047f010203";
    const request = AsnParser.parse(Convert.FromHex(hex), OCSPRequest);
    assert.equal(request.tbsRequest.version, 0);
  });

  it("request build", () => {
    var request = new OCSPRequest({
      tbsRequest: new TBSRequest({
        requestorName: new GeneralName({
          iPAddress: "1.0.1.0",
        }),
        requestList: [
          new Request({
            reqCert: new CertID({
              hashAlgorithm: new AlgorithmIdentifier({
                algorithm: "1.3.14.3.2.26",
              }),
              issuerNameHash: new OctetString(Convert.FromHex("7F010203")),
              issuerKeyHash: new OctetString(Convert.FromHex("7F010203")),
              serialNumber: Convert.FromHex("7F010203"),
            })
          }),
        ]
      }),
    });
    const der = AsnSerializer.serialize(request);
    assert.equal(Convert.ToHex(der), "302b3029a106870401000100301f301d301b300706052b0e03021a04047f01020304047f01020302047f010203");
  })
});

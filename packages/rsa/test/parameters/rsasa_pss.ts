import * as assert from "assert";
import { RsaSaPssParams, id_md5, id_sha1 } from "../../src";
import { AsnConvert } from "@peculiar/asn1-schema";
import { AlgorithmIdentifier } from "@peculiar/asn1-x509";

context("RSASSA-PSS params", () => {

  it("serialize default", () => {
    const params = new RsaSaPssParams();

    const der = AsnConvert.serialize(params);
    assert.strictEqual(Buffer.from(der).toString("hex"), "3000");
  });

  it("serialize hash:md5 ", () => {
    const params = new RsaSaPssParams({
      hashAlgorithm: new AlgorithmIdentifier({
        algorithm: id_md5,
        parameters: null,
      }),
      maskGenAlgorithm: new AlgorithmIdentifier({
        algorithm: id_sha1,
        parameters: AsnConvert.serialize(new AlgorithmIdentifier({
          algorithm: id_sha1,
          parameters: null
        })),
      }),
      saltLength: 1000,
      trailerField: 2,
    });

    const der = AsnConvert.serialize(params);
    // SEQUENCE (4 elem)
    //   [0] (1 elem)
    //     SEQUENCE (2 elem)
    //       OBJECT IDENTIFIER 1.2.840.113549.2.5 md5 (RSADSI digestAlgorithm)
    //       NULL
    //   [1] (1 elem)
    //     SEQUENCE (2 elem)
    //       OBJECT IDENTIFIER 1.3.14.3.2.26 sha1 (OIW)
    //       SEQUENCE (2 elem)
    //         OBJECT IDENTIFIER 1.3.14.3.2.26 sha1 (OIW)
    //         NULL
    //   [2] (1 elem)
    //     INTEGER 1000
    //   [3] (1 elem)
    //     INTEGER 2
    assert.strictEqual(Buffer.from(der).toString("hex"), "3031a00e300c06082a864886f70d02050500a114301206052b0e03021a300906052b0e03021a0500a204020203e8a303020102");
  });

});
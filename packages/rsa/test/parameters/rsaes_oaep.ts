import * as assert from "assert";
import { RsaEsOaepParams, id_md5, id_sha1 } from "../../src";
import { AsnConvert, AsnOctetStringConverter } from "@peculiar/asn1-schema";
import { AlgorithmIdentifier } from "@peculiar/asn1-x509";

context("RSAES-OAEP params", () => {

  it("serialize default", () => {
    const params = new RsaEsOaepParams();

    const der = AsnConvert.serialize(params);
    assert.strictEqual(Buffer.from(der).toString("hex"), "3000");
  });

  it("serialize hash:md5 ", () => {
    const params = new RsaEsOaepParams({
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
      pSourceAlgorithm: new AlgorithmIdentifier({
        algorithm: id_sha1,
        parameters: AsnConvert.serialize(AsnOctetStringConverter.toASN(new Uint8Array([1, 2, 3, 4, 5]).buffer)),
      })
    });

    const der = AsnConvert.serialize(params);

    // SEQUENCE (3 elem)
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
    //     SEQUENCE (2 elem)
    //       OBJECT IDENTIFIER 1.3.14.3.2.26 sha1 (OIW)
    //       OCTET STRING (5 byte) 0102030405
    assert.strictEqual(Buffer.from(der).toString("hex"), "3038a00e300c06082a864886f70d02050500a114301206052b0e03021a300906052b0e03021a0500a210300e06052b0e03021a04050102030405");
  });

});
import * as assert from "node:assert";
import { AsnConvert } from "@peculiar/asn1-schema";
import {
  Certificate, SubjectKeyIdentifier, id_alg_unsigned, id_ce_subjectKeyIdentifier,
} from "@peculiar/asn1-x509";
import {
  MTCCertificationAuthority,
  MTCProof,
  TrustAnchorID,
  decodeSerialNumber,
  encodeSerialNumber,
  id_pe_mtcCertificationAuthority_experimental,
  id_rdna_trustAnchorID_experimental,
  mtcMaxSerial,
} from "../src";

// TrustAsia test MTC CA cosigner certificate, CA ID 44494.3.1.1.
const caCert = [
  "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",
  "AQA=",
].join("");

describe("mtc", () => {
  describe("TrustAnchorID", () => {
    it("decodes the binary representation", () => {
      // 1.3.6.1.4.1.44363.47.1=#0d0481fd5901 from the draft
      const id = TrustAnchorID.fromBinary(new Uint8Array([0x81, 0xfd, 0x59, 0x01]));
      assert.strictEqual(id.value, "32473.1");
    });

    it("round trips", () => {
      const id = new TrustAnchorID("44494.3.1.1");
      assert.strictEqual(TrustAnchorID.fromBinary(id.toBinary()).value, id.value);
    });

    it("encodes a RELATIVE-OID", () => {
      const der = AsnConvert.serialize(new TrustAnchorID("32473.1"));
      assert.strictEqual(Buffer.from(der).toString("hex"), "0d0481fd5901");
    });

    it("parses a RELATIVE-OID", () => {
      const id = AsnConvert.parse(Buffer.from("0d0481fd5901", "hex"), TrustAnchorID);

      assert.strictEqual(id.value, "32473.1");
    });

    it("matches the draft binary representation for 32473.1", () => {
      // draft-ietf-tls-trust-anchor-ids section 3
      assert.deepStrictEqual(
        Array.from(new TrustAnchorID("32473.1").toBinary()),
        [0x81, 0xfd, 0x59, 0x01],
      );
    });

    it("matches the draft SVCB wire-format encodings", () => {
      // draft-ietf-tls-trust-anchor-ids section 6.1, tls-trust-anchors example
      assert.deepStrictEqual(
        Array.from(new TrustAnchorID("32473.2.1").toBinary()),
        [0x81, 0xfd, 0x59, 0x02, 0x01],
      );
      assert.deepStrictEqual(
        Array.from(new TrustAnchorID("32473.2.2").toBinary()),
        [0x81, 0xfd, 0x59, 0x02, 0x02],
      );
      assert.strictEqual(
        TrustAnchorID.fromBinary(new Uint8Array([0x81, 0xfd, 0x59, 0x02, 0x01])).value,
        "32473.2.1",
      );
      assert.strictEqual(
        TrustAnchorID.fromBinary(new Uint8Array([0x81, 0xfd, 0x59, 0x02, 0x02])).value,
        "32473.2.2",
      );
    });

    it("round trips MTC landmark trust anchor IDs", () => {
      // draft-ietf-plants-merkle-tree-certs section 8.2: landmark 42 of CA
      // 32473.1 and log 8, and its landmark group
      for (const value of ["32473.1.1.8.42", "32473.1.2.8.42"]) {
        const id = new TrustAnchorID(value);
        assert.strictEqual(TrustAnchorID.fromBinary(id.toBinary()).value, value);
      }
    });

    it("builds the cosigner_name origin string", () => {
      assert.strictEqual(new TrustAnchorID("32473.1").toOriginString(), "oid/1.3.6.1.4.1.32473.1");
    });

    it("rejects a truncated sub-identifier", () => {
      assert.throws(() => TrustAnchorID.fromBinary(new Uint8Array([0x81, 0xfd])));
    });

    it("rejects a non-minimal sub-identifier", () => {
      assert.throws(() => TrustAnchorID.fromBinary(new Uint8Array([0x80, 0x01])));
    });
  });

  describe("MTCCertificationAuthority", () => {
    it("parses the extension value", () => {
      const hex = "3028300b0609608648016503040201300b0609608648016503040311020100"
        + "020900ffffffffffffffff";
      const ca = AsnConvert.parse(Buffer.from(hex, "hex"), MTCCertificationAuthority);

      assert.strictEqual(ca.logHash.algorithm, "2.16.840.1.101.3.4.2.1");
      assert.strictEqual(ca.sigAlg.algorithm, "2.16.840.1.101.3.4.3.17");
      assert.strictEqual(ca.minSerial, 0n);
      assert.strictEqual(ca.maxSerial, 18446744073709551615n);
    });

    it("round trips maxSerial without precision loss", () => {
      const ca = new MTCCertificationAuthority({ maxSerial: 18446744073709551615n });
      const parsed = AsnConvert.parse(AsnConvert.serialize(ca), MTCCertificationAuthority);

      assert.strictEqual(parsed.maxSerial, 18446744073709551615n);
    });
  });

  describe("serial number", () => {
    it("decomposes into log number and index", () => {
      const res = decodeSerialNumber("000100000000d431");

      assert.strictEqual(res.logNumber, 1);
      assert.strictEqual(res.index, 54321n);
    });

    it("round trips", () => {
      const value = encodeSerialNumber(3, 987654321n);

      assert.deepStrictEqual(decodeSerialNumber(value.toString(16).padStart(16, "0")), {
        logNumber: 3,
        index: 987654321n,
      });
    });

    it("handles the maximum serial number", () => {
      // Log numbers are 1..2^16-1 and indices at most 2^48-1
      // (draft-ietf-plants-merkle-tree-certs sections 5.2 and 6.2), so the
      // largest serial is 2^64-1, mtcMaxSerial.
      const value = encodeSerialNumber(0xffff, 0xffffffffffffn);

      assert.strictEqual(value, mtcMaxSerial);
      assert.deepStrictEqual(decodeSerialNumber(mtcMaxSerial.toString(16).padStart(16, "0")), {
        logNumber: 0xffff,
        index: 0xffffffffffffn,
      });
    });
  });

  describe("MTCProof", () => {
    // extensions(0) start=4 end=8 proof(2x32B) signatures(1: 32473.1, 4B sig)
    const proofHex = "0000"
      + "000000000004" + "000000000008"
      + "0040" + "01".repeat(32) + "02".repeat(32)
      + "000b" + "04" + "81fd5901" + "0004" + "aabbccdd";

    it("parses a standalone certificate proof", () => {
      const proof = MTCProof.parse(Buffer.from(proofHex, "hex"));

      assert.strictEqual(proof.start, 4);
      assert.strictEqual(proof.end, 8);
      assert.strictEqual(proof.subtreeSize, 4);
      assert.strictEqual(proof.inclusionProof.length, 2);
      assert.strictEqual(proof.signatures.length, 1);
      assert.strictEqual(proof.signatures[0].cosignerId.value, "32473.1");
      assert.strictEqual(proof.isLandmarkRelative, false);
    });

    it("flags a landmark-relative certificate", () => {
      const hex = "0000" + "000000000000" + "000000001000" + "0020" + "03".repeat(32) + "0000";
      const proof = MTCProof.parse(Buffer.from(hex, "hex"));

      assert.strictEqual(proof.isLandmarkRelative, true);
      assert.strictEqual(proof.signatures.length, 0);
    });

    it("rejects an inclusion proof that is not a multiple of the hash size", () => {
      const hex = "0000" + "000000000000" + "000000000002" + "0010" + "01".repeat(16) + "0000";

      assert.throws(() => MTCProof.parse(Buffer.from(hex, "hex")), /multiple of hash size/);
    });

    it("honours a non-default hash size", () => {
      const hex = "0000" + "000000000000" + "000000000002" + "0030" + "01".repeat(48) + "0000";
      const proof = MTCProof.parse(Buffer.from(hex, "hex"), { hashSize: 48 });

      assert.strictEqual(proof.inclusionProof.length, 1);
    });

    describe("parse hashSize validation", () => {
      it("rejects hashSize 0 even with a non-empty proof buffer", () => {
        assert.throws(
          () => MTCProof.parse(Buffer.from(proofHex, "hex"), { hashSize: 0 }),
          RangeError,
        );
      });

      it("rejects a negative hashSize", () => {
        assert.throws(
          () => MTCProof.parse(Buffer.from(proofHex, "hex"), { hashSize: -1 }),
          /invalid hashSize/,
        );
      });

      it("rejects a non-integer hashSize", () => {
        assert.throws(
          () => MTCProof.parse(Buffer.from(proofHex, "hex"), { hashSize: 1.5 }),
          /invalid hashSize/,
        );
      });
    });

    it("rejects truncated input", () => {
      assert.throws(() => MTCProof.parse(Buffer.from(proofHex, "hex").subarray(0, 12)));
    });

    it("rejects trailing bytes", () => {
      const raw = Buffer.concat([Buffer.from(proofHex, "hex"), Buffer.from([0x00])]);

      assert.throws(() => MTCProof.parse(raw), /trailing byte/);
    });

    it("rejects unordered cosigner ids", () => {
      const hex = "0000" + "000000000000" + "000000000002" + "0000"
        + "0012"
        + "04" + "81fd5901" + "0002" + "aaaa"
        + "04" + "81fd5900" + "0002" + "bbbb";

      assert.throws(() => MTCProof.parse(Buffer.from(hex, "hex")), /ordered by cosigner_id/);
    });

    it("serializes to JSON", () => {
      const json = MTCProof.parse(Buffer.from(proofHex, "hex")).toJSON();

      assert.strictEqual(json.signatures[0].cosignerId, "32473.1");
      assert.strictEqual(json.signatures[0].signature, "aabbccdd");
    });

    it("does not alias the input buffer in parsed byte fields", () => {
      // One extension (type 1, data "aabb"), start=4 end=8, proof(2x32B),
      // signatures(1: 32473.1, 4B sig)
      const hex = "0006" + "0001" + "0002" + "aabb"
        + "000000000004" + "000000000008"
        + "0040" + "01".repeat(32) + "02".repeat(32)
        + "000b" + "04" + "81fd5901" + "0004" + "aabbccdd";
      const raw = Buffer.from(hex, "hex");
      const before = Buffer.from(raw);
      const proof = MTCProof.parse(raw);

      assert.strictEqual(proof.extensions.length, 1);
      assert.strictEqual(proof.inclusionProof.length, 2);

      proof.inclusionProof[0][0] = 0xff;
      proof.inclusionProof[1][0] = 0xfe;
      proof.signatures[0].signature[0] = 0xfd;
      proof.extensions[0].extensionData[0] = 0xfc;

      assert.ok(raw.equals(before), "parsed byte fields must not alias the input buffer");
    });
  });

  describe("CA certificate", () => {
    it("parses a deployed MTC CA cosigner certificate", () => {
      const cert = AsnConvert.parse(Buffer.from(caCert, "base64"), Certificate);
      const tbs = cert.tbsCertificate;

      // RFC 9925 unsigned certificate, not self-signed despite issuer == subject
      assert.strictEqual(cert.signatureAlgorithm.algorithm, id_alg_unsigned);
      assert.strictEqual(cert.signatureValue.byteLength, 0);

      const rdn = tbs.subject[0][0];
      assert.strictEqual(rdn.type, id_rdna_trustAnchorID_experimental);
      assert.strictEqual(rdn.value.toString(), "44494.3.1.1");

      const ext = tbs.extensions?.find(
        (o) => o.extnID === id_pe_mtcCertificationAuthority_experimental,
      );
      assert.ok(ext);
      assert.strictEqual(ext.critical, true);

      const ca = AsnConvert.parse(ext.extnValue, MTCCertificationAuthority);
      assert.strictEqual(ca.logHash.algorithm, "2.16.840.1.101.3.4.2.1");
      assert.strictEqual(ca.maxSerial, 18446744073709551615n);

      // Subject key identifier is the CA ID in binary trust anchor ID form
      const ski = tbs.extensions?.find((o) => o.extnID === id_ce_subjectKeyIdentifier);
      assert.ok(ski);
      const keyId = AsnConvert.parse(ski.extnValue, SubjectKeyIdentifier);
      assert.strictEqual(TrustAnchorID.fromBinary(new Uint8Array(keyId.buffer)).value, "44494.3.1.1");
    });
  });
});

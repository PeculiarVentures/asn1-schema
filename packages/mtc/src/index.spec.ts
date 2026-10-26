import { describe, expect, it } from "vitest";
import { AsnConvert, OctetString } from "@peculiar/asn1-schema";
import {
  AlgorithmIdentifier,
  AttributeTypeAndValue,
  AttributeValue,
  Certificate,
  Extension,
  Extensions,
  Name,
  RelativeDistinguishedName,
  SubjectKeyIdentifier,
  Validity,
  id_alg_unsigned,
  id_ce_subjectKeyIdentifier,
} from "@peculiar/asn1-x509";
import {
  MTCCertificationAuthority,
  MTCProof,
  TBSCertificateLogEntry,
  TrustAnchorID,
  decodeSerialNumber,
  encodeSerialNumber,
  id_pe_mtcCertificationAuthority_experimental,
  id_rdna_trustAnchorID_experimental,
  mtcMaxSerial,
} from "./index";

// TrustAsia test MTC CA cosigner certificate, CA ID 44494.3.1.1.
const caCert = [
  "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",
  "AQA=",
].join("");

const buildName = (commonName: string, organization: string) =>
  new Name([
    new RelativeDistinguishedName([
      new AttributeTypeAndValue({
        type: "2.5.4.3", // id-at-commonName
        value: new AttributeValue({ utf8String: commonName }),
      }),
    ]),
    new RelativeDistinguishedName([
      new AttributeTypeAndValue({
        type: "2.5.4.10", // id-at-organizationName
        value: new AttributeValue({ utf8String: organization }),
      }),
    ]),
  ]);

describe("mtc", () => {
  describe("TrustAnchorID", () => {
    it("decodes the binary representation", () => {
      // 1.3.6.1.4.1.44363.47.1=#0d0481fd5901 from the draft
      const id = TrustAnchorID.fromBinary(new Uint8Array([0x81, 0xfd, 0x59, 0x01]));
      expect(id.value).toBe("32473.1");
    });

    it("round trips", () => {
      const id = new TrustAnchorID("44494.3.1.1");
      expect(TrustAnchorID.fromBinary(id.toBinary()).value).toBe(id.value);
    });

    it("encodes an empty id as empty bytes", () => {
      // Regression: "".split(".") is [""] and BigInt("") throws; an empty
      // TrustAnchorID must encode to an empty byte array.
      expect(new TrustAnchorID().toBinary().length).toBe(0);
      expect(Array.from(new TrustAnchorID().toBinary())).toStrictEqual([]);
    });

    it("round trips an empty id", () => {
      expect(TrustAnchorID.fromBinary(new Uint8Array(0)).value).toBe("");
      expect(TrustAnchorID.fromBinary(new TrustAnchorID().toBinary()).value).toBe("");
    });

    it("encodes a RELATIVE-OID", () => {
      const der = AsnConvert.serialize(new TrustAnchorID("32473.1"));
      expect(Buffer.from(der).toString("hex")).toBe("0d0481fd5901");
    });

    it("parses a RELATIVE-OID", () => {
      const id = AsnConvert.parse(Buffer.from("0d0481fd5901", "hex"), TrustAnchorID);

      expect(id.value).toBe("32473.1");
    });

    it("matches the draft binary representation for 32473.1", () => {
      // draft-ietf-tls-trust-anchor-ids section 3
      expect(Array.from(new TrustAnchorID("32473.1").toBinary())).toStrictEqual([0x81, 0xfd, 0x59, 0x01]);
    });

    it("matches the draft SVCB wire-format encodings", () => {
      // draft-ietf-tls-trust-anchor-ids section 6.1, tls-trust-anchors example
      expect(Array.from(new TrustAnchorID("32473.2.1").toBinary())).toStrictEqual([0x81, 0xfd, 0x59, 0x02, 0x01]);
      expect(Array.from(new TrustAnchorID("32473.2.2").toBinary())).toStrictEqual([0x81, 0xfd, 0x59, 0x02, 0x02]);
      expect(TrustAnchorID.fromBinary(new Uint8Array([0x81, 0xfd, 0x59, 0x02, 0x01])).value).toBe("32473.2.1");
      expect(TrustAnchorID.fromBinary(new Uint8Array([0x81, 0xfd, 0x59, 0x02, 0x02])).value).toBe("32473.2.2");
    });

    it("round trips MTC landmark trust anchor IDs", () => {
      // draft-ietf-plants-merkle-tree-certs section 8.2: landmark 42 of CA
      // 32473.1 and log 8, and its landmark group
      for (const value of ["32473.1.1.8.42", "32473.1.2.8.42"]) {
        const id = new TrustAnchorID(value);
        expect(TrustAnchorID.fromBinary(id.toBinary()).value).toBe(value);
      }
    });

    it("builds the cosigner_name origin string", () => {
      expect(new TrustAnchorID("32473.1").toOriginString()).toBe("oid/1.3.6.1.4.1.32473.1");
    });

    it("rejects a truncated sub-identifier", () => {
      expect(() => TrustAnchorID.fromBinary(new Uint8Array([0x81, 0xfd]))).toThrow();
    });

    it("rejects a non-minimal sub-identifier", () => {
      expect(() => TrustAnchorID.fromBinary(new Uint8Array([0x80, 0x01]))).toThrow();
    });
  });

  describe("MTCCertificationAuthority", () => {
    it("parses the extension value", () => {
      const hex = "3028300b0609608648016503040201300b0609608648016503040311020100020900ffffffffffffffff";
      const ca = AsnConvert.parse(Buffer.from(hex, "hex"), MTCCertificationAuthority);

      expect(ca.logHash.algorithm).toBe("2.16.840.1.101.3.4.2.1");
      expect(ca.sigAlg.algorithm).toBe("2.16.840.1.101.3.4.3.17");
      expect(ca.minSerial).toBe(0n);
      expect(ca.maxSerial).toBe(18446744073709551615n);
    });

    it("round trips maxSerial without precision loss", () => {
      const ca = new MTCCertificationAuthority({ maxSerial: 18446744073709551615n });
      const parsed = AsnConvert.parse(AsnConvert.serialize(ca), MTCCertificationAuthority);

      expect(parsed.maxSerial).toBe(18446744073709551615n);
    });
  });

  describe("serial number", () => {
    it("decomposes into log number and index", () => {
      const res = decodeSerialNumber("000100000000d431");

      expect(res.logNumber).toBe(1);
      expect(res.index).toBe(54321n);
    });

    it("round trips", () => {
      const value = encodeSerialNumber(3, 987654321n);

      expect(decodeSerialNumber(value.toString(16).padStart(16, "0"))).toStrictEqual({
        logNumber: 3,
        index: 987654321n,
      });
    });

    it("handles the maximum serial number", () => {
      // Log numbers are 1..2^16-1 and indices at most 2^48-1
      // (draft-ietf-plants-merkle-tree-certs sections 5.2 and 6.2), so the
      // largest serial is 2^64-1, mtcMaxSerial.
      const value = encodeSerialNumber(0xffff, 0xffffffffffffn);

      expect(value).toBe(mtcMaxSerial);
      expect(decodeSerialNumber(mtcMaxSerial.toString(16).padStart(16, "0"))).toStrictEqual({
        logNumber: 0xffff,
        index: 0xffffffffffffn,
      });
    });

    it("encodes the valid extremes and decodes them back", () => {
      const min = encodeSerialNumber(1, 0n);
      const max = encodeSerialNumber(65535, 0xffffffffffffn);

      expect(min).toBe(1n << 48n);
      expect(max).toBe(mtcMaxSerial);
      expect(decodeSerialNumber(min.toString(16).padStart(16, "0"))).toStrictEqual({
        logNumber: 1,
        index: 0n,
      });
      expect(decodeSerialNumber(max.toString(16).padStart(16, "0"))).toStrictEqual({
        logNumber: 65535,
        index: 0xffffffffffffn,
      });
    });

    it("rejects out-of-range log numbers", () => {
      expect(() => encodeSerialNumber(0, 0n)).toThrow(RangeError);
      expect(() => encodeSerialNumber(65536, 0n)).toThrow(RangeError);
      expect(() => encodeSerialNumber(1.5, 0n)).toThrow(RangeError);
      expect(() => encodeSerialNumber(NaN, 0n)).toThrow(RangeError);
    });

    it("rejects out-of-range indices", () => {
      expect(() => encodeSerialNumber(1, -1n)).toThrow(RangeError);
      expect(() => encodeSerialNumber(1, 2n ** 48n)).toThrow(RangeError);
    });

    it("rejects out-of-range inputs with a clear message", () => {
      expect(() => encodeSerialNumber(0, 0n)).toThrow(/logNumber must be in 1\.\.65535/);
      expect(() => encodeSerialNumber(65536, 0n)).toThrow(/logNumber must be in 1\.\.65535/);
      expect(() => encodeSerialNumber(1.5, 0n)).toThrow(/logNumber must be in 1\.\.65535/);
      expect(() => encodeSerialNumber(1, -1n)).toThrow(/index must be in 0\.\.2\^48-1/);
      expect(() => encodeSerialNumber(1, 2n ** 48n)).toThrow(/index must be in 0\.\.2\^48-1/);
    });
  });

  describe("MTCProof", () => {
    // extensions(0) start=4 end=8 proof(2x32B) signatures(1: 32473.1, 4B sig)
    const proofHex = "00000000000000040000000000080040" + "01".repeat(32) + "02".repeat(32) + "00000b0481fd59010004aabbccdd";

    it("parses a standalone certificate proof", () => {
      const proof = MTCProof.parse(Buffer.from(proofHex, "hex"));

      expect(proof.start).toBe(4);
      expect(proof.end).toBe(8);
      expect(proof.subtreeSize).toBe(4);
      expect(proof.inclusionProof.length).toBe(2);
      expect(proof.signatures.length).toBe(1);
      expect(proof.signatures[0].cosignerId.value).toBe("32473.1");
      expect(proof.isLandmarkRelative).toBe(false);
    });

    it("flags a landmark-relative certificate", () => {
      const hex = "00000000000000000000000010000020" + "03".repeat(32) + "000000";
      const proof = MTCProof.parse(Buffer.from(hex, "hex"));

      expect(proof.isLandmarkRelative).toBe(true);
      expect(proof.signatures.length).toBe(0);
    });

    it("rejects an inclusion proof that is not a multiple of the hash size", () => {
      const hex = "00000000000000000000000000020010" + "01".repeat(16) + "000000";

      expect(() => MTCProof.parse(Buffer.from(hex, "hex"))).toThrow(/multiple of hash size/);
    });

    it("honours a non-default hash size", () => {
      const hex = "00000000000000000000000000020030" + "01".repeat(48) + "000000";
      const proof = MTCProof.parse(Buffer.from(hex, "hex"), { hashSize: 48 });

      expect(proof.inclusionProof.length).toBe(1);
    });

    describe("parse hashSize validation", () => {
      it("rejects hashSize 0 even with a non-empty proof buffer", () => {
        expect(() => MTCProof.parse(Buffer.from(proofHex, "hex"), { hashSize: 0 })).toThrow(RangeError);
      });

      it("rejects a negative hashSize", () => {
        expect(() => MTCProof.parse(Buffer.from(proofHex, "hex"), { hashSize: -1 })).toThrow(/invalid hashSize/);
      });

      it("rejects a non-integer hashSize", () => {
        expect(() => MTCProof.parse(Buffer.from(proofHex, "hex"), { hashSize: 1.5 })).toThrow(/invalid hashSize/);
      });
    });

    describe("parse start/end validation", () => {
      it("rejects start equal to end", () => {
        // extensions(0) start=5 end=5 proof(empty) signatures(0)
        const hex = "00000000000000050000000000050000000000";

        expect(() => MTCProof.parse(Buffer.from(hex, "hex"))).toThrow(/start must be less than end/);
      });

      it("rejects start greater than end", () => {
        // extensions(0) start=8 end=4 proof(empty) signatures(0)
        const hex = "00000000000000080000000000040000000000";

        expect(() => MTCProof.parse(Buffer.from(hex, "hex"))).toThrow(/start must be less than end/);
      });
    });

    it("rejects truncated input", () => {
      expect(() => MTCProof.parse(Buffer.from(proofHex, "hex").subarray(0, 12))).toThrow();
    });

    it("rejects trailing bytes", () => {
      const raw = Buffer.concat([Buffer.from(proofHex, "hex"), Buffer.from([0x00])]);

      expect(() => MTCProof.parse(raw)).toThrow(/trailing byte/);
    });

    it("rejects unordered cosigner ids", () => {
      const hex = "000000000000000000000000000200000000120481fd59010002aaaa0481fd59000002bbbb";

      expect(() => MTCProof.parse(Buffer.from(hex, "hex"))).toThrow(/ordered by cosigner_id/);
    });

    it("serializes to JSON", () => {
      const json = MTCProof.parse(Buffer.from(proofHex, "hex")).toJSON();

      expect(json.signatures[0].cosignerId).toBe("32473.1");
      expect(json.signatures[0].signature).toBe("aabbccdd");
    });

    it("does not alias the input buffer in parsed byte fields", () => {
      // One extension (type 1, data "aabb"), start=4 end=8, proof(2x32B),
      // signatures(1: 32473.1, 4B sig)
      const hex = "000600010002aabb0000000000040000000000080040" + "01".repeat(32) + "02".repeat(32) + "00000b0481fd59010004aabbccdd";
      const raw = Buffer.from(hex, "hex");
      const before = Buffer.from(raw);
      const proof = MTCProof.parse(raw);

      expect(proof.extensions.length).toBe(1);
      expect(proof.inclusionProof.length).toBe(2);

      proof.inclusionProof[0][0] = 0xff;
      proof.inclusionProof[1][0] = 0xfe;
      proof.signatures[0].signature[0] = 0xfd;
      proof.extensions[0].extensionData[0] = 0xfc;

      expect(raw.equals(before), "parsed byte fields must not alias the input buffer").toBeTruthy();
    });
  });

  describe("CA certificate", () => {
    it("parses a deployed MTC CA cosigner certificate", () => {
      const cert = AsnConvert.parse(Buffer.from(caCert, "base64"), Certificate);
      const tbs = cert.tbsCertificate;

      // RFC 9925 unsigned certificate, not self-signed despite issuer == subject
      expect(cert.signatureAlgorithm.algorithm).toBe(id_alg_unsigned);
      expect(cert.signatureValue.byteLength).toBe(0);

      const rdn = tbs.subject[0][0];
      expect(rdn.type).toBe(id_rdna_trustAnchorID_experimental);
      expect(rdn.value.toString()).toBe("44494.3.1.1");

      const ext = tbs.extensions?.find((o) => o.extnID === id_pe_mtcCertificationAuthority_experimental);
      expect(ext).toBeTruthy();
      expect(ext!.critical).toBe(true);

      const ca = AsnConvert.parse(ext!.extnValue, MTCCertificationAuthority);
      expect(ca.logHash.algorithm).toBe("2.16.840.1.101.3.4.2.1");
      expect(ca.maxSerial).toBe(18446744073709551615n);

      // Subject key identifier is the CA ID in binary trust anchor ID form
      const ski = tbs.extensions?.find((o) => o.extnID === id_ce_subjectKeyIdentifier);
      expect(ski).toBeTruthy();
      const keyId = AsnConvert.parse(ski!.extnValue, SubjectKeyIdentifier);
      expect(TrustAnchorID.fromBinary(new Uint8Array(keyId.buffer)).value).toBe("44494.3.1.1");
    });
  });

  describe("TBSCertificateLogEntry", () => {
    it("round trips a fully populated entry", () => {
      const entry = new TBSCertificateLogEntry({
        version: 1,
        issuer: buildName("MTC CA", "Peculiar Ventures"),
        validity: new Validity({
          notBefore: new Date("2024-01-01T00:00:00Z"),
          notAfter: new Date("2034-01-01T00:00:00Z"),
        }),
        subject: buildName("example.com", "Example Inc"),
        subjectPublicKeyAlgorithm: new AlgorithmIdentifier({ algorithm: "1.2.840.10045.2.1" }),
        subjectPublicKeyInfoHash: new OctetString(new Uint8Array([0x01, 0x02, 0x03, 0x04])),
        issuerUniqueID: new Uint8Array([0xa1, 0xb2, 0xc3]).buffer,
        subjectUniqueID: new Uint8Array([0xd4, 0xe5]).buffer,
        extensions: new Extensions([
          new Extension({
            extnID: id_ce_subjectKeyIdentifier,
            critical: true,
            extnValue: new OctetString(new Uint8Array([0x04, 0x02, 0xaa, 0xbb])),
          }),
        ]),
      });

      const der = AsnConvert.serialize(entry);
      expect(der.byteLength > 0, "serialized DER must not be empty").toBeTruthy();

      const parsed = AsnConvert.parse(der, TBSCertificateLogEntry);

      // version (non-default value is present in the DER)
      expect(parsed.version).toBe(1);

      // issuer
      expect(parsed.issuer.length).toBe(2);
      expect(parsed.issuer[0][0].type).toBe("2.5.4.3");
      expect(parsed.issuer[0][0].value.utf8String).toBe("MTC CA");
      expect(parsed.issuer[1][0].type).toBe("2.5.4.10");
      expect(parsed.issuer[1][0].value.utf8String).toBe("Peculiar Ventures");

      // subject
      expect(parsed.subject[0][0].value.utf8String).toBe("example.com");
      expect(parsed.subject[1][0].value.utf8String).toBe("Example Inc");

      // validity
      expect(parsed.validity.notBefore.getTime().getTime()).toBe(new Date("2024-01-01T00:00:00Z").getTime());
      expect(parsed.validity.notAfter.getTime().getTime()).toBe(new Date("2034-01-01T00:00:00Z").getTime());

      // subjectPublicKeyAlgorithm
      expect(parsed.subjectPublicKeyAlgorithm.algorithm).toBe("1.2.840.10045.2.1");

      // subjectPublicKeyInfoHash
      expect(Buffer.from(parsed.subjectPublicKeyInfoHash.buffer).toString("hex")).toBe("01020304");

      // optional unique IDs (implicit [1]/[2] BitString)
      expect(parsed.issuerUniqueID).toBeTruthy();
      expect(Buffer.from(parsed.issuerUniqueID!).toString("hex")).toBe("a1b2c3");
      expect(parsed.subjectUniqueID).toBeTruthy();
      expect(Buffer.from(parsed.subjectUniqueID!).toString("hex")).toBe("d4e5");

      // optional extensions ([3] EXPLICIT)
      expect(parsed.extensions).toBeTruthy();
      expect(parsed.extensions!.length).toBe(1);
      expect(parsed.extensions![0].extnID).toBe(id_ce_subjectKeyIdentifier);
      expect(parsed.extensions![0].critical).toBe(true);
      expect(Buffer.from(parsed.extensions![0].extnValue.buffer).toString("hex")).toBe("0402aabb");
    });

    it("round trips a minimal entry with default version", () => {
      const entry = new TBSCertificateLogEntry({
        issuer: new Name([
          new RelativeDistinguishedName([
            new AttributeTypeAndValue({
              type: "2.5.4.3",
              value: new AttributeValue({ utf8String: "MTC CA" }),
            }),
          ]),
        ]),
        validity: new Validity({
          notBefore: new Date("2024-01-01T00:00:00Z"),
          notAfter: new Date("2025-01-01T00:00:00Z"),
        }),
        subject: new Name([
          new RelativeDistinguishedName([
            new AttributeTypeAndValue({
              type: "2.5.4.3",
              value: new AttributeValue({ utf8String: "example.com" }),
            }),
          ]),
        ]),
        subjectPublicKeyAlgorithm: new AlgorithmIdentifier({ algorithm: "1.2.840.10045.2.1" }),
        subjectPublicKeyInfoHash: new OctetString(new Uint8Array([0x11, 0x22])),
      });

      const der = AsnConvert.serialize(entry);
      expect(der.byteLength > 0).toBeTruthy();

      const parsed = AsnConvert.parse(der, TBSCertificateLogEntry);

      // version defaults to 0 and is omitted from the DER
      expect(parsed.version).toBe(0);
      expect(parsed.issuer[0][0].value.utf8String).toBe("MTC CA");
      expect(parsed.subject[0][0].value.utf8String).toBe("example.com");
      expect(parsed.subjectPublicKeyInfoHash.buffer.byteLength).toBe(2);
      expect(parsed.issuerUniqueID).toBe(undefined);
      expect(parsed.subjectUniqueID).toBe(undefined);
      expect(parsed.extensions).toBe(undefined);
    });
  });
});

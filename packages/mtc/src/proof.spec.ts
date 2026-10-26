import { describe, expect, it } from "vitest";
import { MTCProof, id_alg_mtcProof, id_rdna_trustAnchorID } from "./index";

// TLS presentation-language encoding, not DER. All signatures here are
// deterministic parser fixtures; these tests do not verify cosignatures.
const header = Buffer.from("00000000000000000000000000010000", "hex");

function vector(bytes: Buffer, width: number): Buffer {
  const length = Buffer.alloc(width);
  length.writeUIntBE(bytes.length, 0, width);
  return Buffer.concat([length, bytes]);
}

function signature(id: string, length: number): Buffer {
  return Buffer.concat([vector(Buffer.from(id, "hex"), 1), vector(Buffer.alloc(length, 0xa5), 2)]);
}

function proof(...signatures: Buffer[]): Buffer {
  return Buffer.concat([header, vector(Buffer.concat(signatures), 3)]);
}

describe("MTCProof current wire framing", () => {
  it("exports the assigned proof and trust anchor name OIDs", () => {
    expect(id_alg_mtcProof).toBe("1.3.6.1.5.5.7.6.67");
    expect(id_rdna_trustAnchorID).toBe("1.3.6.1.5.5.7.25.3");
  });

  it("parses the reported 00 09 7b outer length with a uint16 inner signature", () => {
    const raw = proof(signature("81fd594d", 2420));
    expect(raw.subarray(16, 19).toString("hex")).toBe("00097b");
    const parsed = MTCProof.parse(raw);
    expect(parsed.start).toBe(0);
    expect(parsed.end).toBe(1);
    expect(parsed.subtreeSize).toBe(1);
    expect(parsed.extensions.length).toBe(0);
    expect(parsed.inclusionProof.length).toBe(0);
    expect(parsed.isLandmarkRelative).toBe(false);
    expect(parsed.signatures.length).toBe(1);
    expect(parsed.signatures[0].cosignerId.value).toBe("32473.77");
    expect(parsed.signatures[0].signature.length).toBe(2420);
  });

  it("accepts an outer vector larger than 65535 bytes", () => {
    const raw = proof(signature("01", 32768), signature("02", 32768));
    expect(raw.readUIntBE(16, 3) > 65535).toBeTruthy();
    const parsed = MTCProof.parse(raw);
    expect(parsed.signatures.length).toBe(2);
    expect(parsed.signatures[0].signature.length).toBe(32768);
    expect(parsed.signatures[1].signature.length).toBe(32768);
  });

  it("accepts a three-byte empty signatures vector", () => {
    const raw = proof();
    expect(raw.length).toBe(19);
    expect(MTCProof.parse(raw).isLandmarkRelative).toBe(true);
  });

  it("rejects a truncated uint24 length", () => {
    for (let bytes = 0; bytes < 3; bytes++) {
      expect(() => MTCProof.parse(Buffer.concat([header, Buffer.alloc(bytes)]))).toThrow(RangeError);
    }
  });

  it("rejects every truncation of the reported proof shape", () => {
    const raw = proof(signature("81fd594d", 2420));
    for (let end = 0; end < raw.length; end++) {
      expect(() => MTCProof.parse(raw.subarray(0, end)), `accepted truncation at ${end}`).toThrow();
    }
  });

  it("rejects an inner signature that overruns the outer vector", () => {
    const entry = signature("01", 4);
    entry.writeUInt16BE(5, 2);
    expect(() => MTCProof.parse(proof(entry))).toThrow(RangeError);
  });

  it("rejects trailing bytes outside the declared signatures vector", () => {
    expect(() => MTCProof.parse(Buffer.concat([proof(), Buffer.from([0])]))).toThrow(/trailing byte/);
  });

  it("does not guess the obsolete two-byte framing", () => {
    const entry = signature("81fd594d", 2420);
    expect(() => MTCProof.parse(Buffer.concat([header, vector(entry, 2)]))).toThrow();
    expect(() => MTCProof.parse(Buffer.concat([header, Buffer.alloc(2)]))).toThrow();
  });

  it("continues to reject empty and duplicate cosigner IDs", () => {
    expect(() => MTCProof.parse(proof(signature("", 4)))).toThrow(/empty cosigner_id/);
    expect(() => MTCProof.parse(proof(signature("01", 4), signature("01", 4)))).toThrow(/without duplicates/);
  });

  it("continues to enforce length-first and then lexicographic ID ordering", () => {
    expect(MTCProof.parse(proof(signature("7f", 4), signature("0100", 4))).signatures.length).toBe(2);
    expect(() => MTCProof.parse(proof(signature("0100", 4), signature("7f", 4)))).toThrow(/ordered by cosigner_id/);
    expect(() => MTCProof.parse(proof(signature("02", 4), signature("01", 4)))).toThrow(/ordered by cosigner_id/);
  });
});

import * as assert from "node:assert";
import { MTCProof, id_alg_mtcProof, id_rdna_trustAnchorID } from "../src";

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
    assert.strictEqual(id_alg_mtcProof, "1.3.6.1.5.5.7.6.67");
    assert.strictEqual(id_rdna_trustAnchorID, "1.3.6.1.5.5.7.25.3");
  });

  it("parses the reported 00 09 7b outer length with a uint16 inner signature", () => {
    const raw = proof(signature("81fd594d", 2420));
    assert.strictEqual(raw.subarray(16, 19).toString("hex"), "00097b");
    const parsed = MTCProof.parse(raw);
    assert.strictEqual(parsed.start, 0);
    assert.strictEqual(parsed.end, 1);
    assert.strictEqual(parsed.subtreeSize, 1);
    assert.strictEqual(parsed.extensions.length, 0);
    assert.strictEqual(parsed.inclusionProof.length, 0);
    assert.strictEqual(parsed.isLandmarkRelative, false);
    assert.strictEqual(parsed.signatures.length, 1);
    assert.strictEqual(parsed.signatures[0].cosignerId.value, "32473.77");
    assert.strictEqual(parsed.signatures[0].signature.length, 2420);
  });

  it("accepts an outer vector larger than 65535 bytes", () => {
    const raw = proof(signature("01", 32768), signature("02", 32768));
    assert.ok(raw.readUIntBE(16, 3) > 65535);
    const parsed = MTCProof.parse(raw);
    assert.strictEqual(parsed.signatures.length, 2);
    assert.strictEqual(parsed.signatures[0].signature.length, 32768);
    assert.strictEqual(parsed.signatures[1].signature.length, 32768);
  });

  it("accepts a three-byte empty signatures vector", () => {
    const raw = proof();
    assert.strictEqual(raw.length, 19);
    assert.strictEqual(MTCProof.parse(raw).isLandmarkRelative, true);
  });

  it("rejects a truncated uint24 length", () => {
    for (let bytes = 0; bytes < 3; bytes++) {
      assert.throws(() => MTCProof.parse(Buffer.concat([header, Buffer.alloc(bytes)])), RangeError);
    }
  });

  it("rejects every truncation of the reported proof shape", () => {
    const raw = proof(signature("81fd594d", 2420));
    for (let end = 0; end < raw.length; end++) {
      assert.throws(() => MTCProof.parse(raw.subarray(0, end)), `accepted truncation at ${end}`);
    }
  });

  it("rejects an inner signature that overruns the outer vector", () => {
    const entry = signature("01", 4);
    entry.writeUInt16BE(5, 2);
    assert.throws(() => MTCProof.parse(proof(entry)), RangeError);
  });

  it("rejects trailing bytes outside the declared signatures vector", () => {
    assert.throws(() => MTCProof.parse(Buffer.concat([proof(), Buffer.from([0])])), /trailing byte/);
  });

  it("does not guess the obsolete two-byte framing", () => {
    const entry = signature("81fd594d", 2420);
    assert.throws(() => MTCProof.parse(Buffer.concat([header, vector(entry, 2)])));
    assert.throws(() => MTCProof.parse(Buffer.concat([header, Buffer.alloc(2)])));
  });

  it("continues to reject empty and duplicate cosigner IDs", () => {
    assert.throws(() => MTCProof.parse(proof(signature("", 4))), /empty cosigner_id/);
    assert.throws(() => MTCProof.parse(proof(signature("01", 4), signature("01", 4))), /without duplicates/);
  });

  it("continues to enforce length-first and then lexicographic ID ordering", () => {
    assert.strictEqual(MTCProof.parse(proof(signature("7f", 4), signature("0100", 4))).signatures.length, 2);
    assert.throws(() => MTCProof.parse(proof(signature("0100", 4), signature("7f", 4))), /ordered by cosigner_id/);
    assert.throws(() => MTCProof.parse(proof(signature("02", 4), signature("01", 4))), /ordered by cosigner_id/);
  });
});

import { hex } from "@peculiar/utils/encoding";
import type { BufferSourceLike } from "@peculiar/utils/bytes";
import { ByteStream } from "@peculiar/asn1-tls";
import { TrustAnchorID } from "./trust_anchor_id";

/**
 * ```
 * struct {
 *     MerkleTreeCertEntryExtensionType extension_type;
 *     opaque extension_data<0..2^16-1>;
 * } MerkleTreeCertEntryExtension;
 * ```
 */
export interface IMerkleTreeCertEntryExtension {
  extensionType: number;
  extensionData: Uint8Array;
}

export interface IJsonMTCSignature {
  cosignerId: string;
  signature: string;
}

/**
 * ```
 * struct {
 *     TrustAnchorID cosigner_id;
 *     opaque signature<0..2^16-1>;
 * } MTCSignature;
 * ```
 */
export class MTCSignature {
  public cosignerId: TrustAnchorID;
  public signature: Uint8Array;

  constructor(cosignerId: TrustAnchorID, signature: Uint8Array) {
    this.cosignerId = cosignerId;
    this.signature = signature;
  }

  public toJSON(): IJsonMTCSignature {
    return {
      cosignerId: this.cosignerId.value,
      signature: hex.encode(this.signature),
    };
  }
}

export interface IMTCProofParseOptions {
  /**
   * Output size in bytes of the issuance log's hash function, taken from
   * `logHash` in the CA's {@link MTCCertificationAuthority} extension.
   * Defaults to 32, the size of the RECOMMENDED SHA-256.
   */
  hashSize?: number;
}

export interface IJsonMTCProof {
  start: number;
  end: number;
  inclusionProof: string[];
  signatures: IJsonMTCSignature[];
}

/**
 * ```
 * struct {
 *     MerkleTreeCertEntryExtension extensions<0..2^16-1>;
 *     uint48 start;
 *     uint48 end;
 *     HashValue inclusion_proof<0..2^16-1>;
 *     MTCSignature signatures<0..2^16-1>;
 * } MTCProof;
 * ```
 *
 * Carried in a certificate's `signatureValue` with no ASN.1 wrapping, under the
 * `id-alg-mtcProof` signature algorithm. It is not a signature: verification is
 * subtree inclusion proof evaluation plus cosignature checks against the
 * relying party's trusted cosigners, so ordinary X.509 signature verification
 * does not apply.
 */
export class MTCProof {
  public extensions: IMerkleTreeCertEntryExtension[] = [];
  public start = 0;
  public end = 0;
  public inclusionProof: Uint8Array[] = [];
  public signatures: MTCSignature[] = [];

  /**
   * A landmark-relative certificate carries no cosignatures and is only usable
   * by a relying party already configured with the landmark subtree.
   */
  public get isLandmarkRelative(): boolean {
    return this.signatures.length === 0;
  }

  /** The subtree size, `end - start`. */
  public get subtreeSize(): number {
    return this.end - this.start;
  }

  public static parse(bytes: BufferSourceLike, options: IMTCProofParseOptions = {}): MTCProof {
    const hashSize = options.hashSize ?? 32;
    const res = new MTCProof();
    const stream = new ByteStream(bytes);

    const extensions = new ByteStream(stream.readVector(2));
    let prevType = -1;
    while (extensions.left) {
      const extensionType = extensions.readNumber(2);
      if (extensionType <= prevType) {
        throw new Error("MTCProof: entry extensions must be ascending and unique");
      }
      prevType = extensionType;
      res.extensions.push({
        extensionType, extensionData: extensions.readVector(2),
      });
    }

    res.start = stream.readNumber(6);
    res.end = stream.readNumber(6);

    const proof = stream.readVector(2);
    if (proof.length % hashSize) {
      throw new Error(
        `MTCProof: inclusion_proof is ${proof.length} bytes, not a multiple of hash size ${hashSize}`,
      );
    }
    for (let i = 0; i < proof.length; i += hashSize) {
      res.inclusionProof.push(proof.subarray(i, i + hashSize));
    }

    const signatures = new ByteStream(stream.readVector(2));
    let prevId: Uint8Array | null = null;
    while (signatures.left) {
      const id = signatures.readVector(1);
      if (!id.length) {
        throw new Error("MTCProof: empty cosigner_id");
      }
      if (prevId && !isStrictlyAfter(prevId, id)) {
        throw new Error("MTCProof: signatures must be ordered by cosigner_id without duplicates");
      }
      prevId = id;
      res.signatures.push(
        new MTCSignature(TrustAnchorID.fromBinary(id), signatures.readVector(2)),
      );
    }

    if (stream.left) {
      throw new Error(`MTCProof: ${stream.left} trailing byte(s)`);
    }

    return res;
  }

  public toJSON(): IJsonMTCProof {
    return {
      start: this.start,
      end: this.end,
      inclusionProof: this.inclusionProof.map((o) => hex.encode(o)),
      signatures: this.signatures.map((o) => o.toJSON()),
    };
  }
}

/**
 * Cosigner ID ordering: shorter byte strings first, then lexicographic.
 */
function isStrictlyAfter(prev: Uint8Array, current: Uint8Array): boolean {
  if (current.length !== prev.length) {
    return current.length > prev.length;
  }
  for (let i = 0; i < current.length; i++) {
    if (current[i] !== prev[i]) {
      return current[i] > prev[i];
    }
  }

  return false;
}

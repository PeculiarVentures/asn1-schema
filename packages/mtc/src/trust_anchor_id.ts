import type { IAsnConvertible } from "@peculiar/asn1-schema";
import * as asn1js from "asn1js";

/**
 * ```asn1
 * TrustAnchorID ::= RELATIVE-OID
 * ```
 *
 * CA IDs, log IDs, landmark IDs and cosigner IDs are all trust anchor IDs.
 *
 * `@peculiar/asn1-schema` has no `AsnPropTypes.RelativeObjectIdentifier`, so
 * this class implements {@link IAsnConvertible} directly.
 *
 * @see {@link https://datatracker.ietf.org/doc/draft-ietf-tls-trust-anchor-ids/ | draft-ietf-tls-trust-anchor-ids} section 3
 */
export class TrustAnchorID implements IAsnConvertible<asn1js.RelativeObjectIdentifier> {
  /** Dotted decimal representation, for example `44494.3.1.1`. */
  public value: string;

  constructor(value = "") {
    this.value = value;
  }

  public fromASN(asn: asn1js.RelativeObjectIdentifier): this {
    if (!(asn instanceof asn1js.RelativeObjectIdentifier)) {
      throw new TypeError("Argument 'asn' is not instance of ASN.1 RelativeObjectIdentifier");
    }
    this.value = asn.valueBlock.toString();

    return this;
  }

  public toASN(): asn1js.RelativeObjectIdentifier {
    return new asn1js.RelativeObjectIdentifier({ value: this.value });
  }

  public toSchema(name: string): asn1js.RelativeObjectIdentifier {
    return new asn1js.RelativeObjectIdentifier({ name });
  }

  public toString(): string {
    return this.value;
  }

  /**
   * Decodes the binary representation: the DER *contents* of a `RELATIVE-OID`,
   * that is base-128 sub-identifiers with the high bit set on continuation
   * octets. This form appears in the `MTCProof` cosigner ID and in the subject
   * key identifier of an MTC CA certificate.
   */
  public static fromBinary(bytes: Uint8Array): TrustAnchorID {
    const parts: string[] = [];
    let acc = 0n;
    let started = false;
    for (const byte of bytes) {
      if (!started && byte === 0x80) {
        throw new Error("TrustAnchorID: non-minimal sub-identifier encoding");
      }
      started = true;
      acc = (acc << 7n) | BigInt(byte & 0x7f);
      if (!(byte & 0x80)) {
        parts.push(acc.toString());
        acc = 0n;
        started = false;
      }
    }
    if (started) {
      throw new Error("TrustAnchorID: truncated sub-identifier");
    }

    return new TrustAnchorID(parts.join("."));
  }

  /** Encodes the binary representation. Inverse of {@link fromBinary}. */
  public toBinary(): Uint8Array {
    const res: number[] = [];
    for (const part of this.value.split(".")) {
      let value = BigInt(part);
      const octets = [Number(value & 0x7fn)];
      value >>= 7n;
      while (value > 0n) {
        octets.push(Number(value & 0x7fn) | 0x80);
        value >>= 7n;
      }
      res.push(...octets.reverse());
    }

    return new Uint8Array(res);
  }

  /**
   * The `cosigner_name` / `log_origin` encoding used in `CosignedMessage`:
   * the ASCII string `oid/` followed by the full OID in dotted decimal.
   */
  public toOriginString(): string {
    return `oid/1.3.6.1.4.1.${this.value}`;
  }
}

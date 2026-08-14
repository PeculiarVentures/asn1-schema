import { toUint8Array, type BufferSourceLike } from "@peculiar/utils/bytes";

export interface IMTCSerialNumber {
  /** Issuance log number, `1..65535`. */
  logNumber: number;
  /** Zero-based index of the entry within that log, at most `2^48-1`. */
  index: bigint;
}

/**
 * Decomposes an MTC certificate serial number.
 *
 * `serialNumber` is `(log_number << 48) | index`, so it identifies both the
 * issuance log and the entry within it.
 */
export function decodeSerialNumber(serialNumber: BufferSourceLike | string): IMTCSerialNumber {
  const value = typeof serialNumber === "string" ? BigInt(`0x${serialNumber.replace(/^0x/, "")}`) : toUint8Array(serialNumber).reduce((acc, byte) => (acc << 8n) | BigInt(byte), 0n);

  return {
    logNumber: Number(value >> 48n),
    index: value & 0xffffffffffffn,
  };
}

/**
 * Composes an MTC certificate serial number from a log number and entry index.
 *
 * `logNumber` must be an integer in `1..65535` and `index` at most `2^48-1`
 * (draft-ietf-plants-merkle-tree-certs sections 5.2 and 6.2); out-of-range
 * values would silently bleed into adjacent bit ranges of the serial number.
 */
export function encodeSerialNumber(logNumber: number, index: bigint): bigint {
  if (!Number.isInteger(logNumber) || logNumber < 1 || logNumber > 0xffff) {
    throw new RangeError("encodeSerialNumber: logNumber must be in 1..65535");
  }
  if (index < 0n || index > 0xffffffffffffn) {
    throw new RangeError("encodeSerialNumber: index must be in 0..2^48-1");
  }
  return (BigInt(logNumber) << 48n) | index;
}

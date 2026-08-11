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
  const value = typeof serialNumber === "string"
    ? BigInt(`0x${serialNumber.replace(/^0x/, "")}`)
    : toUint8Array(serialNumber).reduce((acc, byte) => (acc << 8n) | BigInt(byte), 0n);

  return {
    logNumber: Number(value >> 48n),
    index: value & 0xffffffffffffn,
  };
}

/** Composes an MTC certificate serial number from a log number and entry index. */
export function encodeSerialNumber(logNumber: number, index: bigint): bigint {
  return (BigInt(logNumber) << 48n) | index;
}

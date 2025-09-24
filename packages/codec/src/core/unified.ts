import { ParseResult, ParseMode, CapturePolicy } from "../types";
import { AsnNodeUtils, DER } from "../node-utils";
import { TlvParser } from "./tlv";
import { ParseContextImpl } from "../parser-context";

/**
 * Options for unified parser (two-phase only)
 */
export interface UnifiedParseOptions {
  integerAs?: "auto" | "number" | "bigint";
  maxDepth?: number; // limit recursion depth for safety
  captureRaw?: boolean; // whether to capture raw data for all nodes (default: false)
  capturePolicy?: CapturePolicy; // per-node capture policy (overrides captureRaw if provided)
  mode?: ParseMode; // parsing mode: 'der' (strict) or 'ber' (lenient), defaults to 'der'
}

/**
 * ASN.1 parser (two-phase only)
 */
export class AsnParser {
  /**
   * Parse DER data with simplified interface
   */
  static parseDER(data: Uint8Array, opts: UnifiedParseOptions = {}): ParseResult {
    const {
      integerAs = "auto",
      maxDepth = 1000,
      captureRaw = false,
      capturePolicy,
      mode = DER,
    } = opts;

    data = AsnNodeUtils.toUint8Array(data);

    return this.parseClassic(data, integerAs, maxDepth, captureRaw, capturePolicy, mode);
  }

  /**
   * Two-phase parsing: fast TLV pass only
   */
  private static parseClassic(
    data: Uint8Array,
    integerAs: string = "auto",
    maxDepth: number = 1000,
    captureRaw: boolean = false,
    capturePolicy?: CapturePolicy,
    mode: ParseMode = DER,
  ): ParseResult {
    // Prepare capture policy or fallback to simple captureRaw
    const fallbackCaptureBits = captureRaw ? 0b011 : 0b000;

    const ctx = new ParseContextImpl(data, null, integerAs as "auto" | "number" | "bigint");

    // Fast TLV pass for two-phase mode (attach ctx to each node)
    const { node: root, off: endOffset } = TlvParser.parseElement(data, 0, data.length, {
      captureBits: fallbackCaptureBits,
      capturePolicy,
      depth: 0,
      maxDepth,
      mode,
      path: "root",
      ctx,
    });

    const result: ParseResult = { root, ctx };

    // Check if there's unexpected data after the root element
    if (endOffset < data.length) {
      // Check if remaining data contains orphaned EOC markers
      let remainingOff = endOffset;
      while (remainingOff + 1 < data.length) {
        if (data[remainingOff] === 0x00 && data[remainingOff + 1] === 0x00) {
          throw new Error("ASN.1: orphaned EOC marker found after parsing");
        }
        remainingOff++;
      }

      result.remaining = {
        offset: endOffset,
        bytes: data.length - endOffset,
      };
    }

    return result;
  }

  /**
   * Parse DER data from string input (convenience method)
   */
  static parseDERFromString(input: string, opts: UnifiedParseOptions = {}): ParseResult {
    const data = AsnNodeUtils.stringToBytes(input);
    return this.parseDER(data, opts);
  }

  /**
   * Parse DER data from Uint8Array or string (auto-detect)
   */
  static parse(input: Uint8Array | string, opts: UnifiedParseOptions = {}): ParseResult {
    const data = typeof input === "string" ? AsnNodeUtils.stringToBytes(input) : input;
    return this.parseDER(data, opts);
  }
}

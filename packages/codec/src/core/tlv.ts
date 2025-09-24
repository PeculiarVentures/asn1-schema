import { AsnNodeUtils, DER } from "../node-utils";
import { AsnNode, ParseMode, CapturePolicy } from "../types";
import { evaluateCapture } from "./capture";

/**
 * Capture level bitmasks (local constants)
 */
const CAPTURE_VALUE_RAW = 1;
const CAPTURE_RAW = 2;

export interface TlvParsedElement {
  node: AsnNode;
  off: number;
}

export interface TlvParseOptions {
  captureBits?: number; // fallback capture bits when no policy provided
  capturePolicy?: CapturePolicy; // per-node capture policy
  depth?: number;
  maxDepth?: number;
  mode?: ParseMode;
  path?: string; // current path for per-node capture evaluation
}

const asn1PrimitiveTypes = [1, 2, 5, 6, 9, 10, 13];
/**
 * Simplified iterative TLV parser - core ASN.1 DER/BER parsing logic
 */
export class TlvParser {
  /**
   * Parse one DER element with depth control
   */
  static parseElement(
    data: Uint8Array,
    off: number,
    limit: number,
    options: TlvParseOptions,
  ): TlvParsedElement {
    const {
      captureBits: fallbackCaptureBits = 0,
      capturePolicy,
      depth = 0,
      maxDepth = 1000,
      mode = DER,
      path = "root",
    } = options;

    // Determine capture bits for this specific node (only if policy is provided)
    let captureBits: number;
    if (capturePolicy) {
      captureBits = evaluateCapture(capturePolicy, path, 0); // schemaId=0 since we don't have schema binding yet
    } else {
      captureBits = fallbackCaptureBits;
    }
    const strict = mode === DER;

    if (depth > maxDepth) {
      throw new Error(`ASN.1: maximum parsing depth exceeded (${maxDepth})`);
    }

    // Check for EOC at top level (invalid)
    if (depth === 0 && off + 1 < data.length && data[off] === 0x00 && data[off + 1] === 0x00) {
      throw new Error("ASN.1: EOC marker at top level is invalid");
    }

    const node = AsnNodeUtils.makeNode();
    node.start = off;

    // Parse tag
    if (off >= data.length) throw new Error("ASN.1: truncated tag");
    const tagByte = data[off++];
    node.tagClass = tagByte >>> 6;
    node.constructed = (tagByte & 0x20) !== 0;
    let type = tagByte & 0x1f;

    if (type === 0x1f) {
      // Long-form tag
      type = 0;
      let first = true;
      for (;;) {
        if (off >= data.length) throw new Error("ASN.1: truncated long tag");
        const nb = data[off++];

        // Check for leading zero in long-form tag (non-minimal)
        if (first && (nb & 0x7f) === 0) {
          throw new Error("ASN.1: long-form tag with leading zero is non-minimal");
        }
        first = false;

        type = (type << 7) | (nb & 0x7f);
        if ((nb & 0x80) === 0) break;
      }

      // Check if long-form was used for tag < 31 (non-minimal)
      if (type < 31) {
        throw new Error("ASN.1: long-form tag used for tag number < 31 is non-minimal");
      }
    }
    node.type = type;

    // Validate constructed flag for universal types that must be primitive
    if (node.tagClass === 0 && node.constructed) {
      // Universal types that must always be primitive
      if (asn1PrimitiveTypes.includes(node.type)) {
        throw new Error(`ASN.1: tag ${node.type} cannot be constructed`);
      }

      // In strict DER mode, OCTET STRING and BIT STRING must also be primitive
      if (strict && (node.type === 3 || node.type === 4)) {
        throw new Error(`ASN.1: tag ${node.type} cannot be constructed in DER mode`);
      }
    }

    // Parse length
    const { len, off: off2 } = AsnNodeUtils.parseLength(data, off, mode);
    off = off2;

    const contentStart = off;
    let end = off + len;
    const isIndefinite = len === -1;

    if (!isIndefinite && end > limit) {
      throw new Error(`ASN.1: length exceeds limit (end=${end}, limit=${limit})`);
    }
    node.headerEnd = contentStart;
    node.end = end;

    // Parse children if constructed
    if (node.constructed) {
      const children: AsnNode[] = [];
      let childOff = contentStart;

      if (isIndefinite) {
        // Parse until EOC marker
        while (childOff < limit) {
          // Check for EOC marker
          if (childOff + 1 < limit && data[childOff] === 0x00 && data[childOff + 1] === 0x00) {
            end = childOff + 2;
            break;
          }

          const childPath = capturePolicy ? `${path}[${children.length}]` : path;
          const childOptions = capturePolicy
            ? {
                captureBits: fallbackCaptureBits,
                capturePolicy,
                depth: depth + 1,
                maxDepth,
                mode,
                path: childPath,
              }
            : {
                captureBits: fallbackCaptureBits,
                depth: depth + 1,
                maxDepth,
                mode,
              };

          const { node: child, off: newOff } = this.parseElement(
            data,
            childOff,
            limit,
            childOptions,
          );
          children.push(child);
          childOff = newOff;

          // Check if child parsing ended with an EOC that should close this level
          if (childOff + 1 < limit && data[childOff] === 0x00 && data[childOff + 1] === 0x00) {
            end = childOff + 2;
            break;
          }
        }

        if (end === off + len) {
          // EOC was not found
          throw new Error("ASN.1: missing EOC marker for indefinite length");
        }
      } else {
        // Definite length
        while (childOff < end) {
          const childPath = capturePolicy ? `${path}[${children.length}]` : path;
          const childOptions = capturePolicy
            ? {
                captureBits: fallbackCaptureBits,
                capturePolicy,
                depth: depth + 1,
                maxDepth,
                mode,
                path: childPath,
              }
            : {
                captureBits: fallbackCaptureBits,
                depth: depth + 1,
                maxDepth,
                mode,
              };

          const { node: child, off: newOff } = this.parseElement(data, childOff, end, childOptions);
          children.push(child);
          childOff = newOff;
        }
      }

      node.children = children;
    } else {
      if (isIndefinite) {
        throw new Error("ASN.1: indefinite length not allowed on primitive types");
      }
    }

    node.end = end;

    // Capture raw data only if requested (performance optimization)
    // Do this after determining the actual end position
    if (captureBits & CAPTURE_RAW) {
      node.raw = data.subarray(node.start, end);
    }
    if (captureBits & CAPTURE_VALUE_RAW) {
      node.valueRaw = data.subarray(contentStart, end);
    }

    return { node, off: end };
  }
}

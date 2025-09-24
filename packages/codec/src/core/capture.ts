import { CapturePolicy, CaptureLevel, AsnNode } from "../types";

/**
 * Capture level bitmasks
 */
export const CAPTURE_VALUE_RAW = 1;
export const CAPTURE_RAW = 2;
export const CAPTURE_DECODED = 4;

/**
 * Convert CaptureLevel to bitmask
 */
export function captureLevelToBitmask(level: CaptureLevel): number {
  switch (level) {
    case "none":
      return 0;
    case "valueRaw":
      return CAPTURE_VALUE_RAW;
    case "raw":
      return CAPTURE_RAW;
    case "decoded":
      return CAPTURE_DECODED;
    default:
      return 0;
  }
}

/**
 * Evaluate capture policy for a node (enhanced with path/type/field support)
 */
export function evaluateCapture(
  policy: CapturePolicy,
  path: string,
  schemaId: number,
  fieldName?: string,
  typeName?: string,
): number {
  // Check specific overrides in priority order
  const fromPath = policy.byPath?.[path];
  const fromField = policy.byField?.[fieldName ?? ""];
  const fromType = policy.byType?.[typeName ?? ""];

  // Use first match, fallback to default
  const level = fromPath ?? fromField ?? fromType ?? policy.default;
  return captureLevelToBitmask(level);
}

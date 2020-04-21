import { AsnPropTypes, AsnProp } from "@peculiar/asn1-schema";
import { LogotypeImageResolution } from "./logotype_image_resolution";

/**
 * ```
 * LogotypeImageType ::= INTEGER { grayScale(0), color(1) }
 * ```
 */
export enum LogotypeImageType {
  grayScale = 0,
  color = 1,
}

/**
 * ```
 * LogotypeImageInfo ::= SEQUENCE {
 *   type            [0] LogotypeImageType DEFAULT color,
 *   fileSize        INTEGER,  -- In octets
 *   xSize           INTEGER,  -- Horizontal size in pixels
 *   ySize           INTEGER,  -- Vertical size in pixels
 *   resolution      LogotypeImageResolution OPTIONAL,
 *   language        [4] IA5String OPTIONAL }  -- RFC 3066 Language Tag
 * ```
 */
export class LogotypeImageInfo {

  @AsnProp({ type: AsnPropTypes.Integer, context: 0, implicit: true, defaultValue: LogotypeImageType.color })
  public type: LogotypeImageType = LogotypeImageType.color;

  /**
   * In octets
   */
  @AsnProp({ type: AsnPropTypes.Integer })
  public fileSize = 0;

  /**
   * Horizontal size in pixels
   */
  @AsnProp({ type: AsnPropTypes.Integer })
  public xSize = 0;

  /**
   * Vertical size in pixels
   */
  @AsnProp({ type: AsnPropTypes.Integer })
  public ySize = 0;

  @AsnProp({ type: LogotypeImageResolution })
  public resolution?: LogotypeImageResolution;

  /**
   * RFC 3066 Language Tag
   */
  @AsnProp({ type: AsnPropTypes.IA5String, context: 4, implicit: true, optional: true })
  public language?: string;

  constructor(params: Partial<LogotypeImageInfo> = {}) {
    Object.assign(this, params);
  }
}
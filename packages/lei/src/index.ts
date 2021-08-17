import { AsnType, AsnTypeTypes, AsnProp, AsnPropTypes } from "@peculiar/asn1-schema";
import { PrintableString } from "asn1js";

/**
 * ```
 * Lei     OBJECT IDENTIFIER ::= {1 3 6 1 4 1 52266 1}
 * ```
 */
export const id_lei = "1.3.6.1.4.1.52266.1";

/**
 * ```
 * Lei     ::= SEQUENCE {
 *   leiCode         PrintableString(SIZE(20)),
 *   leiRole [0]     EXPLICIT PrintableString(SIZE(1..ub-leiRole-length))
 *                   OPTIONAL
 *    }
 * ```
 */
@AsnType({ type: AsnTypeTypes.Sequence })
export class Lei {

  @AsnProp({ type: PrintableString })
  public leiCode: string = "";

  @AsnProp({ type: PrintableString, context: 0, optional: true })
  public leiRole?: string;

  public constructor(params: Partial<Lei> = {}) {
    Object.assign(this, params);
  }
}

@AsnType({ type: AsnTypeTypes.Choice })
export class LeiChoice {

  /**
   * ```
   * PrintableString(SIZE(20))
   * ```
   */
  @AsnProp({ type: AsnPropTypes.PrintableString })
  public text?: string;

  @AsnProp({ type: Lei })
  public struct?: Lei;

  constructor(value?: string | Lei) {
    if (typeof value === "string") {
      this.text = value;
    } else if (value instanceof Lei) {
      this.struct = value;
    }
  }
}

/**
 * ```
 * Role     OBJECT IDENTIFIER ::= {1 3 6 1 4 1 52266 2}
 * ```
 */
export const id_role = "1.3.6.1.4.1.52266.2";

/**
 * ```
 * roleExtension EXTENSION ::= {
 *   SYNTAX PrintableString(SIZE(1.. ub-leiRole-length))
 *   IDENTIFIED BY role}
 * ```
 */
@AsnType({ type: AsnTypeTypes.Choice })
export class LeiRole {

  /**
   * ```
   * PrintableString(SIZE(1.. ub-leiRole-length))
   * ```
   */
  @AsnProp({ type: AsnPropTypes.PrintableString })
  public text = "";

  public constructor(value?: string) {
    if (value) {
      this.text = value;
    }
  }
}

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
  public leiCode = "";

  @AsnProp({ type: PrintableString, context: 0, optional: true })
  public leiRole?: string;

  public constructor(params: Partial<Lei> = {}) {
    Object.assign(this, params);
  }
}

@AsnType({ type: AsnTypeTypes.Choice })
export class BaseLeiChoice {
  /**
  * @deprecated non-standard
  */
  @AsnProp({ type: AsnPropTypes.IA5String })
  public ia5String?: string;

  /**
   * @deprecated non-standard
   */
  @AsnProp({ type: AsnPropTypes.VisibleString })
  public visibleString?: string;

  /**
   * @deprecated non-standard
   */
  @AsnProp({ type: AsnPropTypes.BmpString })
  public bmpString?: string;

  /**
   * @deprecated non-standard
   */
  @AsnProp({ type: AsnPropTypes.Utf8String })
  public utf8String?: string;

  /**
   * ```
   * PrintableString(SIZE(20))
   * ```
   */
  @AsnProp({ type: AsnPropTypes.PrintableString })
  public printableString?: string;

  public get text(): string | undefined {
    if (this.bmpString !== undefined) {
      return this.bmpString;
    }
    if (this.ia5String !== undefined) {
      return this.ia5String;
    }
    if (this.printableString !== undefined) {
      return this.printableString;
    }
    if (this.utf8String !== undefined) {
      return this.utf8String;
    }
    if (this.visibleString !== undefined) {
      return this.visibleString;
    }

    return undefined;
  }

  public set text(value: string | undefined) {
    this.printableString = value;
  }

  public constructor(value?: string) {
    if (value) {
      this.text = value;
    }
  }
}

@AsnType({ type: AsnTypeTypes.Choice })
export class LeiChoice extends BaseLeiChoice {

  @AsnProp({ type: Lei })
  public struct?: Lei;

  constructor(value?: string | Lei) {
    super();

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
export class LeiRole extends BaseLeiChoice { }

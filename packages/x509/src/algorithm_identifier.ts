import { AsnProp, AsnPropTypes } from "@peculiar/asn1-schema";
import * as pvtsutils from "pvtsutils";

export type ParametersType = ArrayBuffer | null;

/**
 * ```
 * AlgorithmIdentifier  ::=  SEQUENCE  {
 *   algorithm               OBJECT IDENTIFIER,
 *   parameters              ANY DEFINED BY algorithm OPTIONAL  }
 *                              -- contains a value of the type
 *                              -- registered for use with the
 *                              -- algorithm object identifier value
 * ```
 */
export class AlgorithmIdentifier {

  @AsnProp({
    type: AsnPropTypes.ObjectIdentifier,
  })
  public algorithm: string = "";

  @AsnProp({
    type: AsnPropTypes.Any,
    optional: true,
  })
  public parameters?: ParametersType;

  constructor(params: Partial<Omit<AlgorithmIdentifier, "isEqual">> = {}) {
    Object.assign(this, params);
  }

  public isEqual(data: unknown): data is this {
    return data instanceof AlgorithmIdentifier
      && data.algorithm == this.algorithm
      && (
        (
          data.parameters && this.parameters
          && pvtsutils.isEqual(data.parameters, this.parameters)
        )
        ||
        (
          data.parameters === this.parameters
        )
      )
  }
}

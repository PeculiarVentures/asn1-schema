import { AsnProp, AsnPropTypes } from "@peculiar/asn1-schema";

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

  constructor(params: Partial<AlgorithmIdentifier> = {}) {
    Object.assign(this, params);
  }
}

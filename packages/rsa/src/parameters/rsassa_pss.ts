import { AsnProp, AsnConvert, AsnPropTypes } from "@peculiar/asn1-schema";
import { AlgorithmIdentifier } from "@peculiar/asn1-x509";
import { id_sha1, id_mgf1 } from "../object_identifiers";

/**
 * ```
 * TrailerField ::= INTEGER { trailerFieldBC(1) }
 * ```
 */
export type TrailerField = number;

/**
 * RSASSA-PSS-params ::= SEQUENCE {
 *   hashAlgorithm      [0] HashAlgorithm      DEFAULT sha1,
 *   maskGenAlgorithm   [1] MaskGenAlgorithm   DEFAULT mgf1SHA1,
 *   saltLength         [2] INTEGER            DEFAULT 20,
 *   trailerField       [3] TrailerField       DEFAULT trailerFieldBC
 * }
 */
export class RsaSaPssParams {

  @AsnProp({ type: AlgorithmIdentifier, context: 0, defaultValue: new AlgorithmIdentifier({ algorithm: id_sha1, parameters: null }) })
  public hashAlgorithm = new AlgorithmIdentifier({ algorithm: id_sha1, parameters: null })

  @AsnProp({
    type: AlgorithmIdentifier, context: 1, defaultValue: new AlgorithmIdentifier({
      algorithm: id_mgf1,
      parameters: AsnConvert.serialize(new AlgorithmIdentifier({
        algorithm: id_sha1,
        parameters: null,
      })),
    })
  })
  public maskGenAlgorithm = new AlgorithmIdentifier({
    algorithm: id_mgf1,
    parameters: AsnConvert.serialize(new AlgorithmIdentifier({
      algorithm: id_sha1,
      parameters: null,
    })),
  });

  @AsnProp({ type: AsnPropTypes.Integer, context: 2, defaultValue: 20 })
  public saltLength = 20;

  @AsnProp({ type: AsnPropTypes.Integer, context: 3, defaultValue: 1 })
  public trailerField: TrailerField = 1;

  constructor(params: Partial<RsaSaPssParams> = {}) {
    Object.assign(this, params);
  }
}
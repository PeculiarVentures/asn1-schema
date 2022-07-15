import { AsnProp, AsnConvert } from "@peculiar/asn1-schema";
import { AlgorithmIdentifier } from "@peculiar/asn1-x509";
import { id_mgf1, id_RSAES_OAEP } from "../object_identifiers";
import { sha1, mgf1SHA1, pSpecifiedEmpty } from "../algorithms";

/**
 * ```
 * RSAES-OAEP-params ::= SEQUENCE {
 *   hashAlgorithm      [0] HashAlgorithm     DEFAULT sha1,
 *   maskGenAlgorithm   [1] MaskGenAlgorithm  DEFAULT mgf1SHA1,
 *   pSourceAlgorithm   [2] PSourceAlgorithm  DEFAULT pSpecifiedEmpty
 * }
 * ```
 */
export class RsaEsOaepParams {

  @AsnProp({ type: AlgorithmIdentifier, context: 0, defaultValue: sha1 })
  public hashAlgorithm = new AlgorithmIdentifier(sha1);

  @AsnProp({ type: AlgorithmIdentifier, context: 1, defaultValue: mgf1SHA1 })
  public maskGenAlgorithm = new AlgorithmIdentifier({
    algorithm: id_mgf1,
    parameters: AsnConvert.serialize(sha1),
  });

  @AsnProp({ type: AlgorithmIdentifier, context: 2, defaultValue: pSpecifiedEmpty })
  public pSourceAlgorithm = new AlgorithmIdentifier(pSpecifiedEmpty);

  constructor(params: Partial<RsaEsOaepParams> = {}) {
    Object.assign(this, params);
  }
}

/**
 * ```
 * { OID id-RSAES-OAEP   PARAMETERS RSAES-OAEP-params } |
 * ```
 */
export const RSAES_OAEP = new AlgorithmIdentifier({
  algorithm: id_RSAES_OAEP,
  parameters: AsnConvert.serialize(new RsaEsOaepParams()),
});

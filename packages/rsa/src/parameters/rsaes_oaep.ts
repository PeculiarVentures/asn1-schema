import { AsnProp, AsnConvert, AsnOctetStringConverter } from "@peculiar/asn1-schema";
import { AlgorithmIdentifier } from "@peculiar/asn1-x509";
import { id_sha1, id_mgf1, id_pSpecified } from "../object_identifiers";

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


  @AsnProp({
    type: AlgorithmIdentifier, context: 2, defaultValue: new AlgorithmIdentifier({
      algorithm: id_pSpecified,
      parameters: AsnConvert.serialize(AsnOctetStringConverter.toASN(new Uint8Array([0xda, 0x39, 0xa3, 0xee, 0x5e, 0x6b, 0x4b, 0x0d, 0x32, 0x55, 0xbf, 0xef, 0x95, 0x60, 0x18, 0x90, 0xaf, 0xd8, 0x07, 0x09]).buffer)),
    })
  })

  public pSourceAlgorithm = new AlgorithmIdentifier({
    algorithm: id_pSpecified,
    parameters: AsnConvert.serialize(AsnOctetStringConverter.toASN(new Uint8Array([0xda, 0x39, 0xa3, 0xee, 0x5e, 0x6b, 0x4b, 0x0d, 0x32, 0x55, 0xbf, 0xef, 0x95, 0x60, 0x18, 0x90, 0xaf, 0xd8, 0x07, 0x09]).buffer)),
  });

  constructor(params: Partial<RsaEsOaepParams> = {}) {
    Object.assign(this, params);
  }
}

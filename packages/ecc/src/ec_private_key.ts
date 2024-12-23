import { AsnProp, AsnPropTypes, OctetString } from "@peculiar/asn1-schema";
import { ECParameters } from "./ec_parameters";
/**
 * ```asn1
 * ECPrivateKey ::= SEQUENCE {
 *   version        INTEGER { ecPrivkeyVer1(1) } (ecPrivkeyVer1),
 *   privateKey     OCTET STRING,
 *   parameters [0] ECParameters {{ NamedCurve }} OPTIONAL,
 *   publicKey  [1] BIT STRING OPTIONAL
 * }
 * ```
 */
export class ECPrivateKey {
  @AsnProp({ type: AsnPropTypes.Integer })
  public version = 1;

  @AsnProp({ type: OctetString })
  public privateKey = new OctetString();

  @AsnProp({ type: ECParameters, context: 0, optional: true })
  public parameters?: ECParameters;

  @AsnProp({ type: AsnPropTypes.BitString, context: 1, optional: true })
  public publicKey?: ArrayBuffer;

  constructor(params: Partial<ECPrivateKey> = {}) {
    Object.assign(this, params);
  }
}

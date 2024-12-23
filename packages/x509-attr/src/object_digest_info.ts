import { AsnProp, AsnPropTypes } from "@peculiar/asn1-schema";
import { AlgorithmIdentifier } from "@peculiar/asn1-x509";

export enum DigestedObjectType {
  publicKey = 0,
  publicKeyCert = 1,
  otherObjectTypes = 2,
}

/**
 * ```asn1
 * ObjectDigestInfo    ::= SEQUENCE {
 *      digestedObjectType  ENUMERATED {
 *           publicKey            (0),
 *           publicKeyCert        (1),
 *           otherObjectTypes     (2) },
 *                   -- otherObjectTypes MUST NOT
 *                   -- MUST NOT be used in this profile
 *      otherObjectTypeID   OBJECT IDENTIFIER  OPTIONAL,
 *      digestAlgorithm     AlgorithmIdentifier,
 *      objectDigest        BIT STRING
 * }
 * ```
 */
export class ObjectDigestInfo {
  @AsnProp({ type: AsnPropTypes.Enumerated })
  public digestedObjectType = DigestedObjectType.publicKey;

  @AsnProp({ type: AsnPropTypes.ObjectIdentifier, optional: true })
  public otherObjectTypeID?: string;

  @AsnProp({ type: AlgorithmIdentifier })
  public digestAlgorithm = new AlgorithmIdentifier();

  @AsnProp({ type: AsnPropTypes.BitString })
  public objectDigest = new ArrayBuffer(0);

  constructor(params: Partial<ObjectDigestInfo> = {}) {
    Object.assign(this, params);
  }
}

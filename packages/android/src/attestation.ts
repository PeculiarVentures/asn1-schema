import { AsnProp, AsnPropTypes, OctetString } from "@peculiar/asn1-schema";

/**
 * Implements ASN.1 structure for attestation package info.
 *
 * ```asn
 * AttestationPackageInfo ::= SEQUENCE {
 *   package_name  OCTET_STRING,
 *   version       INTEGER,
 * }
 * ```
 */
export class AttestationPackageInfo {
  @AsnProp({ type: AsnPropTypes.OctetString })
  public packageName!: OctetString;

  @AsnProp({ type: AsnPropTypes.Integer })
  public version!: number;

  constructor(params: Partial<AttestationPackageInfo> = {}) {
    Object.assign(this, params);
  }
}

/**
 * Implements ASN.1 structure for attestation application id.
 *
 * ```asn
 * AttestationApplicationId ::= SEQUENCE {
 *   package_infos      SET OF AttestationPackageInfo,
 *   signature_digests  SET OF OCTET_STRING,
 * }
 * ```
 */
export class AttestationApplicationId {
  @AsnProp({ type: AttestationPackageInfo, repeated: "set" })
  public packageInfos!: AttestationPackageInfo[];

  @AsnProp({ type: AsnPropTypes.OctetString, repeated: "set" })
  public signatureDigests!: OctetString[];

  constructor(params: Partial<AttestationApplicationId> = {}) {
    Object.assign(this, params);
  }
}

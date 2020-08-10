import { AsnProp, AsnType, AsnTypeTypes, AsnArray } from "@peculiar/asn1-schema";
import { GeneralName } from "@peculiar/asn1-x509";
import { IssuerSerial } from "./issuer_serial";
import { ObjectDigestInfo } from "./object_digest_info";

/**
 * ```
 * TargetCert  ::= SEQUENCE {
 *      targetCertificate  IssuerSerial,
 *      targetName         GeneralName OPTIONAL,
 *      certDigestInfo     ObjectDigestInfo OPTIONAL
 * }
 * ```
 */
export class TargetCert {

  @AsnProp({ type: IssuerSerial })
  public targetCertificate = new IssuerSerial();

  @AsnProp({ type: GeneralName, optional: true })
  public targetName?: GeneralName;

  @AsnProp({ type: ObjectDigestInfo, optional: true })
  public certDigestInfo?: ObjectDigestInfo;

  constructor(params: Partial<TargetCert> = {}) {
    Object.assign(this, params);
  }
}

/** 
 * ```
 * Target  ::= CHOICE {
 *      targetName     [0] GeneralName,
 *      targetGroup    [1] GeneralName,
 *      targetCert     [2] TargetCert
 * }
 * ```
 */
@AsnType({ type: AsnTypeTypes.Choice })
export class Target {

  @AsnProp({ type: GeneralName, context: 0, implicit: true })
  public targetName?: GeneralName;

  @AsnProp({ type: GeneralName, context: 1, implicit: true })
  public targetGroup?: GeneralName;

  @AsnProp({ type: TargetCert, context: 2, implicit: true })
  public targetCert?: TargetCert;

  constructor(params: Partial<Target> = {}) {
    Object.assign(this, params);
  }
}

/**
 * ```
 * Targets ::= SEQUENCE OF Target
 * ```
 */
@AsnType({ type: AsnTypeTypes.Sequence, itemType: Target })
export class Targets extends AsnArray<Target> {

  constructor(items?: Target[]) {
    super(items);

    // Set the prototype explicitly.
    Object.setPrototypeOf(this, Targets.prototype);
  }

}

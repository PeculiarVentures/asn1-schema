import { AsnProp, AsnType, AsnTypeTypes, AsnPropTypes } from "@peculiar/asn1-schema";

// re-ocsp-archive-cutoff EXTENSION ::= { SYNTAX ArchiveCutoff
//                                        IDENTIFIED BY
//                                        id-pkix-ocsp-archive-cutoff }

/**
 * ```
 * ArchiveCutoff ::= GeneralizedTime
 * ```
 */
@AsnType({ type: AsnTypeTypes.Choice })
export class ArchiveCutoff {

  @AsnProp({ type: AsnPropTypes.GeneralizedTime })
  public value: Date;

  constructor(value = new Date()) {
    this.value = value;
  }
}
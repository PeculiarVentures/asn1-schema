import * as asn1 from "asn1js";
import { AsnProp, AsnPropTypes, AsnType, IAsnConverter, AsnTypeTypes } from "@peculiar/asn1-schema";
import { RelativeDistinguishedName } from "../name";
import { GeneralName } from "../general_name";
import { id_ce } from "../object_identifiers";

/**
 * ```
 * id-ce-cRLDistributionPoints OBJECT IDENTIFIER ::=  { id-ce 31 }
 * ```
 */
export const id_ce_cRLDistributionPoints = `${id_ce}.31`;

export type ReasonFlags = "unused" | "keyCompromise" | "cACompromise" | "affiliationChanged" | "superseded"
  | "cessationOfOperation" | "certificateHold" | "privilegeWithdrawn" | "aACompromise";

/**
 * ```
 * ReasonFlags ::= BIT STRING {
 *   unused                  (0),
 *   keyCompromise           (1),
 *   cACompromise            (2),
 *   affiliationChanged      (3),
 *   superseded              (4),
 *   cessationOfOperation    (5),
 *   certificateHold         (6),
 *   privilegeWithdrawn      (7),
 *   aACompromise            (8) }
 * ```
 */
const ReasonFlagConverter: IAsnConverter<ReasonFlags[]> = {
  fromASN: (value: any) => {
    const reasonFlags: ReasonFlags[] = [];
    const valueHex = new Uint8Array(value.valueBlock.valueHex);
    const unusedBits = value.valueBlock.unusedBits;
    let reasonFlagsByte1 = valueHex[0];
    let reasonFlagsByte2 = valueHex.byteLength > 1 ? valueHex[1] : 0;
    if (valueHex.byteLength === 1) {
      reasonFlagsByte1 >>= unusedBits;
      reasonFlagsByte1 <<= unusedBits;
    }
    if (valueHex.byteLength === 2) {
      reasonFlagsByte2 >>= unusedBits;
      reasonFlagsByte2 <<= unusedBits;
    }
    if (reasonFlagsByte1 & 0x80) {
      reasonFlags.push("unused");
    }
    if (reasonFlagsByte1 & 0x40) {
      reasonFlags.push("keyCompromise");
    }
    if (reasonFlagsByte1 & 0x20) {
      reasonFlags.push("cACompromise");
    }
    if (reasonFlagsByte1 & 0x10) {
      reasonFlags.push("affiliationChanged");
    }
    if (reasonFlagsByte1 & 0x08) {
      reasonFlags.push("superseded");
    }
    if (reasonFlagsByte1 & 0x04) {
      reasonFlags.push("cessationOfOperation");
    }
    if (reasonFlagsByte1 & 0x02) {
      reasonFlags.push("certificateHold");
    }
    if (reasonFlagsByte1 & 0x01) {
      reasonFlags.push("privilegeWithdrawn");
    }
    if (reasonFlagsByte2 & 0x80) {
      reasonFlags.push("aACompromise");
    }
    return reasonFlags;
  },
  toASN: (value: ReasonFlags[]) => {
    const valueHex = new Uint8Array(value.indexOf("aACompromise") !== -1 ? 2 : 1);
    let unusedBits = 0;
    if (value.indexOf("unused") !== -1) {
      valueHex[0] |= 0x80;
      unusedBits = 7;
    }
    if (value.indexOf("keyCompromise") !== -1) {
      valueHex[0] |= 0x40;
      unusedBits = 6;
    }
    if (value.indexOf("cACompromise") !== -1) {
      valueHex[0] |= 0x20;
      unusedBits = 5;
    }
    if (value.indexOf("affiliationChanged") !== -1) {
      valueHex[0] |= 0x10;
      unusedBits = 4;
    }
    if (value.indexOf("superseded") !== -1) {
      valueHex[0] |= 0x08;
      unusedBits = 3;
    }
    if (value.indexOf("cessationOfOperation") !== -1) {
      valueHex[0] |= 0x04;
      unusedBits = 2;
    }
    if (value.indexOf("certificateHold") !== -1) {
      valueHex[0] |= 0x02;
      unusedBits = 1;
    }
    if (value.indexOf("privilegeWithdrawn") !== -1) {
      valueHex[0] |= 0x01;
      unusedBits = 0;
    }
    if (value.indexOf("aACompromise") !== -1) {
      valueHex[1] |= 0x80;
      unusedBits = 7;
    }
    return new asn1.BitString({ unusedBits, valueHex: valueHex.buffer });
  },
};

/**
 * ```
 * DistributionPointName ::= CHOICE {
 *   fullName                [0]     GeneralNames,
 *   nameRelativeToCRLIssuer [1]     RelativeDistinguishedName }
 * ```
 */
@AsnType({ type: AsnTypeTypes.Choice })
export class DistributionPointName {

  @AsnProp({ type: GeneralName, context: 0, repeated: "sequence", implicit: true })
  public fullName?: GeneralName[];

  @AsnProp({ type: RelativeDistinguishedName, context: 1, implicit: true })
  public nameRelativeToCRLIssuer?: RelativeDistinguishedName;

  constructor(params: Partial<DistributionPointName> = {}) {
    Object.assign(this, params);
  }
}

/**
 * ```
 * DistributionPoint ::= SEQUENCE {
 *   distributionPoint       [0]     DistributionPointName OPTIONAL,
 *   reasons                 [1]     ReasonFlags OPTIONAL,
 *   cRLIssuer               [2]     GeneralNames OPTIONAL }
 * ```
 */
export class DistributionPoint {

  @AsnProp({ type: DistributionPointName, context: 0, optional: true })
  public distributionPoint?: DistributionPointName;

  @AsnProp({ type: AsnPropTypes.BitString, context: 1, optional: true, implicit: true,
    converter: ReasonFlagConverter,
   })
  public reasons?: ReasonFlags[];

  @AsnProp({ type: GeneralName, context: 2, optional: true, repeated: "sequence", implicit: true })
  public cRLIssuer?: GeneralName[];

  constructor(params: Partial<DistributionPoint> = {}) {
    Object.assign(this, params);
  }
}

/**
 * ```
 * CRLDistributionPoints ::= SEQUENCE SIZE (1..MAX) OF DistributionPoint
 * ```
 */
export class CRLDistributionPoints {

  @AsnProp({ type: DistributionPoint, repeated: true })
  public items: DistributionPoint[];

  constructor(items: DistributionPoint[] = []) {
    this.items = items;
  }
}

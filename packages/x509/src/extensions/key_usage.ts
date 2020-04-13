import * as asn1 from "asn1js";
import { AsnProp, AsnPropTypes, AsnType, IAsnConverter, AsnTypeTypes } from "@peculiar/asn1-schema";
import { id_ce } from "../object_identifiers";

/**
 * ```
 * id-ce-keyUsage OBJECT IDENTIFIER ::=  { id-ce 15 }
 * ```
 */
export const id_ce_keyUsage = `${id_ce}.15`;

export type KeyUsageType = "digitalSignature" | "nonRepudiation" | "keyEncipherment" | "dataEncipherment"
  | "keyAgreement" | "keyCertSign" | "crlSign" | "encipherOnly" | "decipherOnly";

const KeyUsageConverter: IAsnConverter<KeyUsageType[]> = {
  fromASN: (value: any) => {
    const keyUsage: KeyUsageType[] = [];
    const valueHex = new Uint8Array(value.valueBlock.valueHex);
    const unusedBits = value.valueBlock.unusedBits;
    let keyUsageByte1 = valueHex[0];
    let keyUsageByte2 = valueHex.byteLength > 1 ? valueHex[1] : 0;
    if (valueHex.byteLength === 1) {
      keyUsageByte1 >>= unusedBits;
      keyUsageByte1 <<= unusedBits;
    }
    if (valueHex.byteLength === 2) {
      keyUsageByte2 >>= unusedBits;
      keyUsageByte2 <<= unusedBits;
    }
    if (keyUsageByte1 & 0x80) {
      keyUsage.push("digitalSignature");
    }
    if (keyUsageByte1 & 0x40) {
      keyUsage.push("nonRepudiation");
    }
    if (keyUsageByte1 & 0x20) {
      keyUsage.push("keyEncipherment");
    }
    if (keyUsageByte1 & 0x10) {
      keyUsage.push("dataEncipherment");
    }
    if (keyUsageByte1 & 0x08) {
      keyUsage.push("keyAgreement");
    }
    if (keyUsageByte1 & 0x04) {
      keyUsage.push("keyCertSign");
    }
    if (keyUsageByte1 & 0x02) {
      keyUsage.push("crlSign");
    }
    if (keyUsageByte1 & 0x01) {
      keyUsage.push("encipherOnly");
    }
    if (keyUsageByte2 & 0x80) {
      keyUsage.push("decipherOnly");
    }
    return keyUsage;
  },
  toASN: (value: KeyUsageType[]) => {
    const valueHex = new Uint8Array(value.indexOf("decipherOnly") !== -1 ? 2 : 1);
    let unusedBits = 0;
    if (value.indexOf("digitalSignature") !== -1) {
      valueHex[0] |= 0x80;
      unusedBits = 7;
    }
    if (value.indexOf("nonRepudiation") !== -1) {
      valueHex[0] |= 0x40;
      unusedBits = 6;
    }
    if (value.indexOf("keyEncipherment") !== -1) {
      valueHex[0] |= 0x20;
      unusedBits = 5;
    }
    if (value.indexOf("dataEncipherment") !== -1) {
      valueHex[0] |= 0x10;
      unusedBits = 4;
    }
    if (value.indexOf("keyAgreement") !== -1) {
      valueHex[0] |= 0x08;
      unusedBits = 3;
    }
    if (value.indexOf("keyCertSign") !== -1) {
      valueHex[0] |= 0x04;
      unusedBits = 2;
    }
    if (value.indexOf("crlSign") !== -1) {
      valueHex[0] |= 0x02;
      unusedBits = 1;
    }
    if (value.indexOf("encipherOnly") !== -1) {
      valueHex[0] |= 0x01;
      unusedBits = 0;
    }
    if (value.indexOf("decipherOnly") !== -1) {
      valueHex[1] |= 0x80;
      unusedBits = 7;
    }
    return new asn1.BitString({ unusedBits, valueHex: valueHex.buffer });
  },
};

/**
 * ```
 * KeyUsage ::= BIT STRING {
 *   digitalSignature        (0),
 *   nonRepudiation          (1), -- recent editions of X.509 have
 *                        -- renamed this bit to contentCommitment
 *   keyEncipherment         (2),
 *   dataEncipherment        (3),
 *   keyAgreement            (4),
 *   keyCertSign             (5),
 *   cRLSign                 (6),
 *   encipherOnly            (7),
 *   decipherOnly            (8) }
 * ```
 */
@AsnType({ type: AsnTypeTypes.Choice })
export class KeyUsage {

  @AsnProp({ type: AsnPropTypes.BitString, converter: KeyUsageConverter })
  public usages: KeyUsageType[] = [];

  constructor(usages?: KeyUsageType[]) {
    if (usages) {
      this.usages = usages;
    }
  }

}

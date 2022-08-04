import { BitString } from "@peculiar/asn1-schema";
import { id_ce } from "../object_identifiers";

/**
 * ```
 * id-ce-keyUsage OBJECT IDENTIFIER ::=  { id-ce 15 }
 * ```
 */
export const id_ce_keyUsage = `${id_ce}.15`;

export type KeyUsageType = "digitalSignature" | "nonRepudiation" | "keyEncipherment" | "dataEncipherment"
  | "keyAgreement" | "keyCertSign" | "crlSign" | "encipherOnly" | "decipherOnly";

export enum KeyUsageFlags {
  digitalSignature = 0x0001,
  nonRepudiation = 0x0002,
  keyEncipherment = 0x0004,
  dataEncipherment = 0x0008,
  keyAgreement = 0x0010,
  keyCertSign = 0x0020,
  cRLSign = 0x0040,
  encipherOnly = 0x0080,
  decipherOnly = 0x0100,
}

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
export class KeyUsage extends BitString {

  public toJSON(): KeyUsageType[] {
    const flag = this.toNumber();
    const res: KeyUsageType[] = [];
    if (flag & KeyUsageFlags.cRLSign) {
      res.push("crlSign");
    }
    if (flag & KeyUsageFlags.dataEncipherment) {
      res.push("dataEncipherment");
    }
    if (flag & KeyUsageFlags.decipherOnly) {
      res.push("decipherOnly");
    }
    if (flag & KeyUsageFlags.digitalSignature) {
      res.push("digitalSignature");
    }
    if (flag & KeyUsageFlags.encipherOnly) {
      res.push("encipherOnly");
    }
    if (flag & KeyUsageFlags.keyAgreement) {
      res.push("keyAgreement");
    }
    if (flag & KeyUsageFlags.keyCertSign) {
      res.push("keyCertSign");
    }
    if (flag & KeyUsageFlags.keyEncipherment) {
      res.push("keyEncipherment");
    }
    if (flag & KeyUsageFlags.nonRepudiation) {
      res.push("nonRepudiation");
    }
    return res;
  }

  public override toString(): string {
    return `[${this.toJSON().join(", ")}]`;
  }

}

import { AsnProp, AsnPropTypes, BitString } from "@peculiar/asn1-schema";

/**
 * ```
 * id-entrust-entrustVersInfo      OBJECT IDENTIFIER ::= {iso(1)
 *   member-body(2) us(840) nortelnetworks(113533) entrust(7)
 *   nsn-ce(65) 0}
 * ```
 */
export const id_entrust_entrustVersInfo = "1.2.840.113533.7.65.0";

export type EntrustInfoType = "keyUpdateAllowed" | "newExtensions" | "pKIXCertificate";

export enum EntrustInfoFlags {
  keyUpdateAllowed = 0x0001,
  newExtensions = 0x0002,
  pKIXCertificate = 0x0004,
}

/**
 * ```
 * EntrustInfoFlags ::= BIT STRING {
 *   keyUpdateAllowed        (0),
 *   newExtensions           (1),  -- not used
 *   pKIXCertificate         (2) } -- certificate created by pkix
 * ```
 */
export class EntrustInfo extends BitString {
  public toJSON(): EntrustInfoType[] {
    const res: EntrustInfoType[] = [];
    const flags = this.toNumber();
    if (flags & EntrustInfoFlags.pKIXCertificate) {
      res.push("pKIXCertificate");
    }
    if (flags & EntrustInfoFlags.newExtensions) {
      res.push("newExtensions");
    }
    if (flags & EntrustInfoFlags.keyUpdateAllowed) {
      res.push("keyUpdateAllowed");
    }
    return res;
  }

  public override toString(): string {
    return `[${this.toJSON().join(", ")}]`;
  }
}

/**
 * ```
 * EntrustVersionInfo ::= SEQUENCE {
 *     entrustVers	GeneralString,
 *     entrustInfoFlags	EntrustInfoFlags }
 * ```
 */
export class EntrustVersionInfo {

  @AsnProp({ type: AsnPropTypes.GeneralString })
  public entrustVers = '';

  @AsnProp({ type: EntrustInfo })
  public entrustInfoFlags = new EntrustInfo();

  constructor(params: Partial<EntrustVersionInfo> = {}) {
    Object.assign(this, params);
  }
}

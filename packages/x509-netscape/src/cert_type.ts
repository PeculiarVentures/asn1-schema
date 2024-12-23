import { id_netscapeCertExtension } from "./object_identifiers";
import { BitString } from "@peculiar/asn1-schema";

/**
 * ```asn1
 * netscape-cert-type OBJECT IDENTIFIER ::= { netscape-cert-extension 1 }
 * ```
 */
export const id_netscapeCertType = `${id_netscapeCertExtension}.1`;

export type NetscapeCertTypeString =
  | "sslClient"
  | "sslServer"
  | "sMime"
  | "objectSigning"
  | "sslCa"
  | "sMimeCa"
  | "objectSigningCa";

export type NetscapeCertTypes = NetscapeCertTypeString[];

export enum NetscapeCertTypeFlags {
  /**
   * Indicates a certificate that is certified for SSL client authentication use
   */
  sslClient = 0x0001,
  /**
   * Indicates a certificate that is certified for SSL server authentication use
   */
  sslServer = 0x0002,
  /**
   * Indicates a certificate that is certified for use by clients
   */
  sMime = 0x0004,
  /**
   * Indicates a certificate that is certified for signing objects such as Java applets ans plugins
   */
  objectSigning = 0x0008,
  // reserved = 0x0010,
  /**
   * Indicates a certificate that is certified for issuing certs for SSL use
   */
  sslCa = 0x0020,
  /**
   * Indicates a certificate that is certified for issuing certs for S/MIME use
   */
  sMimeCa = 0x0040,
  /**
   * Indicates a certificate that is certified for issuing certs for Object Signing
   */
  objectSigningCa = 0x0080,
}

export class NetscapeCertType extends BitString {
  public toJSON(): NetscapeCertTypes {
    const flag = this.toNumber();
    const res: NetscapeCertTypes = [];
    if (flag & NetscapeCertTypeFlags.objectSigning) {
      res.push("objectSigning");
    }
    if (flag & NetscapeCertTypeFlags.objectSigningCa) {
      res.push("objectSigningCa");
    }
    if (flag & NetscapeCertTypeFlags.sMime) {
      res.push("sMime");
    }
    if (flag & NetscapeCertTypeFlags.sMimeCa) {
      res.push("sMimeCa");
    }
    if (flag & NetscapeCertTypeFlags.sslCa) {
      res.push("sslCa");
    }
    if (flag & NetscapeCertTypeFlags.sslClient) {
      res.push("sslClient");
    }
    if (flag & NetscapeCertTypeFlags.sslServer) {
      res.push("sslServer");
    }
    return res;
  }

  public override toString(): string {
    return `[${this.toJSON().join(", ")}]`;
  }
}

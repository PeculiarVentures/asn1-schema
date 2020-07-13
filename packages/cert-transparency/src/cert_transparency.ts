import { OctetString } from "@peculiar/asn1-schema";
import { SignedCertificateTimestamp } from "./timestamp";
import { ByteStream } from "./byte_stream";

export const id_certificateTransparency = "1.3.6.1.4.1.11129.2.4.2";
/**
 * ```
 * CertificateTransparency ::= OCTET STRING
 * ```
 */
export class CertificateTransparency extends OctetString {

  public items: SignedCertificateTimestamp[] = [];

  public fromASN(asn: any) {
    const res = super.fromASN(asn);

    // parse value
    const stream = new ByteStream(res);
    const len = stream.readNumber(2);
    res.items = [];
    while (stream.position < len) {
      res.items.push(new SignedCertificateTimestamp(stream));
    }

    return res;
  }
  public toJSON() {
    return this.items.map(o => o.toJSON());
  }
}
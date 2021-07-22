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

  public override fromASN(asn: any) {
    super.fromASN(asn);

    // parse value
    const stream = new ByteStream(this.buffer);
    const len = stream.readNumber(2);
    this.items = [];
    while (stream.position < len) {
      this.items.push(new SignedCertificateTimestamp(stream));
    }

    return this;
  }
  public toJSON() {
    return this.items.map(o => o.toJSON());
  }
}
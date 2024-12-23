import {
  AsnType,
  AsnTypeTypes,
  AsnProp,
  AsnPropTypes,
  AsnIntegerArrayBufferConverter,
} from "@peculiar/asn1-schema";
import { Convert } from "pvtsutils";

export const id_caVersion = "1.3.6.1.4.1.311.21.1";

export interface ICaVersion {
  certificateIndex: number;
  keyIndex: number;
}

/**
 * Microsoft CA version extension
 * @see https://www.sysadmins.lv/blog-en/how-to-encode-and-decode-ca-version-extension.aspx
 */
@AsnType({ type: AsnTypeTypes.Choice })
export class CaVersion {
  @AsnProp({ type: AsnPropTypes.Integer, converter: AsnIntegerArrayBufferConverter })
  public value = new ArrayBuffer(0);

  public toString(): string {
    const version = this.getVersion();
    return `V${version.certificateIndex}.${version.keyIndex}`;
  }

  public getVersion(): ICaVersion {
    let data = new Uint8Array(this.value);
    if (this.value.byteLength < 4) {
      data = new Uint8Array(4);
      data.set(new Uint8Array(this.value), 4 - this.value.byteLength);
    }

    return {
      keyIndex: parseInt(Convert.ToHex(data.slice(0, 2)), 16),
      certificateIndex: parseInt(Convert.ToHex(data.slice(2)), 16),
    } as ICaVersion;
  }
}

import * as ip from "ipaddr.js";
import { Convert } from "pvtsutils";

export class IpConverter {
  private static decodeIP(value: string): string {
    if (value.length === 64 && parseInt(value, 16) === 0) {
      return "::/0";
    }

    if (value.length !== 16) {
      return value;
    }

    const mask = parseInt(value.slice(8), 16)
      .toString(2)
      .split("")
      .reduce((a, k) => a + +k, 0);
    let ip = value.slice(0, 8).replace(/(.{2})/g, (match) => `${parseInt(match, 16)}.`);

    ip = ip.slice(0, -1);

    return `${ip}/${mask}`;
  }

  public static toString(buf: ArrayBuffer): string {
    if (buf.byteLength === 4 || buf.byteLength === 16) {
      const uint8 = new Uint8Array(buf);
      const addr = ip.fromByteArray(Array.from(uint8));
      return addr.toString();
    }
    return this.decodeIP(Convert.ToHex(buf));
  }

  public static fromString(text: string): ArrayBuffer {
    const addr = ip.parse(text);
    return new Uint8Array(addr.toByteArray()).buffer;
  }
}

import * as ip from "ipaddr.js";

export class IpConverter {
  public static toString(buf: ArrayBuffer) {
    const uint8 = new Uint8Array(buf);
    const addr = ip.fromByteArray(Array.from(uint8));
    return addr.toString();
  }
  public static fromString(text: string): ArrayBuffer {
    const addr = ip.parse(text);
    return new Uint8Array(addr.toByteArray()).buffer;
  }
}

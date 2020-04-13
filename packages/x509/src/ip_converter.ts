export class IpConverter {
  public static isV4(value: string) {
    return /^(\d{1,3}\.){3,3}\d{1,3}$/.test(value);
  }
  public static isV6(value: string) {
    return /^(::)?(((\d{1,3}\.){3}(\d{1,3}){1})?([0-9a-f]){0,4}:{0,2}){1,8}(::)?$/i.test(value);
  }
  public static toString(buf: ArrayBuffer) {
    const data = new Uint8Array(buf);
    if (buf.byteLength === 4) {
      // v4
      const res: string[] = [];
      data.forEach((octet) => {
        res.push(octet.toString());
      });
      return res.join(".");
    } else {
      throw new Error("IP V6 is not implemented");
    }
  }
  public static fromString(text: string): ArrayBuffer {
    if (this.isV4(text)) {
      const bytes = text.split(".").map((byte) => parseInt(byte, 10) & 0xff);
      return new Uint8Array(bytes).buffer;
    } else {
      throw new Error("IP V6 is not implemented");
    }
  }
}

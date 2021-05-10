import { Convert } from "pvtsutils";

export type StringEnconding = "utf8" | "binary" | "base64" | "base64url" | "hex";

export class ViewObject {

  public static readonly DEFAULT_VIEW = new Uint8Array();
  public view = ViewObject.DEFAULT_VIEW;

  /**
   * Returns a string representation of BER octets
   * @param encoding Encoding format
   * @returns A string representation of BER octets
   */
  public toString(encoding: StringEnconding) {
    return Convert.ToString(this.view, encoding);
  }
}
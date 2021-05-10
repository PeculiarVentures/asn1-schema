import { ASNObject } from "./Object";

export class ASNIA5String extends ASNObject {

  public static readonly DEFAULT_BER_IDENTIFIER = new Uint8Array([0x16]);

  public get value(): string {
    return this.content.toString("binary");
  }
}

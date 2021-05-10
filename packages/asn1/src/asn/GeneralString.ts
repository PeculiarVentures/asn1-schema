import { ASNObject } from "./Object";

export class ASNGeneralString extends ASNObject {

  public static readonly DEFAULT_BER_IDENTIFIER = new Uint8Array([0x1b]);

  public get value(): string {
    return this.content.toString("binary");
  }
}

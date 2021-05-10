import { ASNObject } from "./Object";

export class ASNVisibleString extends ASNObject {

  public static readonly DEFAULT_BER_IDENTIFIER = new Uint8Array([0x1a]);

  public get value(): string {
    return this.content.toString("binary");
  }
}

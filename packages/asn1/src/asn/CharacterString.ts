import { ASNObject } from "./Object";

export class ASNCharacterString extends ASNObject {

  public static readonly DEFAULT_BER_IDENTIFIER = new Uint8Array([0x1d]);

  public get value(): string {
    return this.content.toString("binary");
  }
}

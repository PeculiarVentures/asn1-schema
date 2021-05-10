import { ASNObject } from "./Object";

export class ASNGraphicString extends ASNObject {

  public static readonly DEFAULT_BER_IDENTIFIER = new Uint8Array([0x19]);

  public get value(): string {
    return this.content.toString("binary");
  }
}

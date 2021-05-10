import { ASNObject } from "./Object";

export class ASNNumericString extends ASNObject {

  public static readonly DEFAULT_BER_IDENTIFIER = new Uint8Array([0x12]);

  public get value(): string {
    return this.content.toString("binary");
  }
}

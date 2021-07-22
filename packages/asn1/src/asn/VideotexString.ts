import { ASNObject } from "./Object";

export class ASNVideotexString extends ASNObject {

  public static override readonly DEFAULT_BER_IDENTIFIER = new Uint8Array([0x15]);

  public get value(): string {
    return this.content.toString("binary");
  }
}

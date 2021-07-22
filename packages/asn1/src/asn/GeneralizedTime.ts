import { ASNObject } from "./Object";

export class ASNGeneralizedTime extends ASNObject {

  public static override readonly DEFAULT_BER_IDENTIFIER = new Uint8Array([0x18]);

  public get value(): string {
    return this.content.toString("binary");
  }
}

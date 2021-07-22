import { ASNObject } from "./Object";

export class ASNUtf8String extends ASNObject {

  public static override readonly DEFAULT_BER_IDENTIFIER = new Uint8Array([0x0C]);

  public get value(): string {
    return this.content.toString("utf8");
  }
}

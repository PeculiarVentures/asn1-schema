import { AsnObject } from "./Object";
import { universal } from "./Types";

@universal(24)
export class AsnGeneralizedTime extends AsnObject {

  public static override readonly DEFAULT_BER_IDENTIFIER = new Uint8Array([0x18]);

  public get value(): string {
    return this.content.toString("binary");
  }
}
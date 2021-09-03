import { AsnObject } from "./Object";

export class AsnNull extends AsnObject {

  public static override readonly DEFAULT_BER_IDENTIFIER = new Uint8Array([0x05]);

  public readonly value = null;
}

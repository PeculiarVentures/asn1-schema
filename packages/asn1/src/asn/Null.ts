import { AsnObject } from "./Object";
import { universal } from "./Types";

@universal(5)
export class AsnNull extends AsnObject {

  public static override readonly DEFAULT_BER_IDENTIFIER = new Uint8Array([0x05]);

  public readonly value = null;
}

import { AsnString } from "./String";

export class AsnTeletexString extends AsnString {

  public static override readonly DEFAULT_BER_IDENTIFIER = new Uint8Array([0x14]);

}

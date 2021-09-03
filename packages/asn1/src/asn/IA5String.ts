import { AsnString } from "./String";

export class AsnIA5String extends AsnString {

  public static override readonly DEFAULT_BER_IDENTIFIER = new Uint8Array([0x16]);

}

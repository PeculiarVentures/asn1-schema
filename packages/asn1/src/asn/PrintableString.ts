import { AsnString } from "./String";
import { universal } from "./Types";

@universal(19)
export class AsnPrintableString extends AsnString {

  public static override readonly BER_IDENTIFIER = new Uint8Array([0x13]);
  public static readonly NAME = "PrintableString";

  public readonly name: typeof AsnPrintableString.NAME = AsnPrintableString.NAME;

}

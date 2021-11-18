import { AsnConverter } from "./Converter";
import { BERObject, BERIdentifierOctets } from "../ber";
import { StringEncoding } from "../ViewObject";
import { Convert } from "pvtsutils";

export type AsnStringEncoding = StringEncoding | "asn";

export abstract class AsnObject extends BERObject {

  public static readonly BER_IDENTIFIER = new Uint8Array([0x00]);

  public readonly abstract name: string;

  public items: AsnObject[] | null = null;

  constructor() {
    super();

    this.identifier = BERIdentifierOctets.fromBER((this.constructor as typeof AsnObject).BER_IDENTIFIER);
  }

  public override toString(encoding: AsnStringEncoding = "asn"): string {
    if (encoding === "asn") {
      return this.toAsnString();
    }
    
    return Convert.ToString(AsnConverter.serialize(this), encoding);
  }

  protected abstract toAsnString(): string;

}

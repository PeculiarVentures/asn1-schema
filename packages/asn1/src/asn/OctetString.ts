import { BufferSource, BufferSourceConverter } from "pvtsutils";
import { Utils } from "..";
import { AsnObject } from "./Object";
import { universal } from "./Types";

@universal(4)
export class AsnOctetString extends AsnObject {

  public static override readonly BER_IDENTIFIER = new Uint8Array([0x04]);
  public static readonly NAME = "OCTET STRING";

  public readonly name: typeof AsnOctetString.NAME = AsnOctetString.NAME;

  constructor(value?: BufferSource) {
    super();

    if (value !== undefined) {
      this.value = BufferSourceConverter.toUint8Array(value);
    }
  }

  public get value() {
    return this.content.view;
  }

  public set value(value: Uint8Array) {
    this.content.view = value;
  }

  protected override toAsnString(): string {
    const data = Utils.toHexString(this.value, "  ");
    return `${this.name}\n${data}`;
  }

}

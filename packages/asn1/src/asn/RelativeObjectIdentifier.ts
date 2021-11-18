import { AsnObject } from "./Object";
import { Utils } from "../Utils";
import { ViewWriter } from "../ViewWriter";
import { universal } from "./Types";

@universal(13)
export class AsnRelativeObjectIdentifier extends AsnObject {

  public static override readonly BER_IDENTIFIER = new Uint8Array([0x0D]);
  public static readonly SPLITTER = " ";
  public static readonly NAME = "RelativeObjectIdentifier";

  public readonly name: typeof AsnRelativeObjectIdentifier.NAME = AsnRelativeObjectIdentifier.NAME;

  protected readSubIdentifiers() {
    const subIdentifiers: Uint8Array[] = [];

    let offset = 0;
    for (let i = 0; i < this.content.view.length; i++) {
      const octet = this.content.view[i];
      if (octet & 0x80) {
        continue;
      }
      subIdentifiers.push(this.content.view.subarray(offset, i + 1));
      offset = i + 1;
    }

    return subIdentifiers;
  }

  public get value(): string {
    return this.readSubIdentifiers()
      .map(o => Utils.toBase(o.map(Utils.disableLastBit), 7))
      .join(AsnRelativeObjectIdentifier.SPLITTER);
  }

  public set value(value: string) {
    const writer = new ViewWriter();

    const subIdentifiers = value.split(AsnRelativeObjectIdentifier.SPLITTER)
      .map(o => +o);
    for (const subIdentifier of subIdentifiers) {
      const view = Utils.fromBase(subIdentifier, 7).map(Utils.enableLastBit);
      writer.write(view);
    }

    this.content.view = writer.toUint8Array();
  }

  protected override toAsnString(): string {
    return `${this.name} '${this.value}'`;
  }

}

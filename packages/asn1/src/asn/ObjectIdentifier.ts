import { BufferSource, BufferSourceConverter } from "pvtsutils";
import { Utils } from "../Utils";
import { ViewWriter } from "../ViewWriter";
import { AsnObject } from "./Object";
import { universal } from "./Types";

export class ObjectIdentifierConverter {

  public static isObjectIdentifier(text: string): boolean {
    return /^(?:(?:[01]\.(?:[0-9]|[1-3][0-9]))|(?:[2]\.[0-9]+))(?:\.[0-9]+)*$/.test(text);
  }

  public static assert(text: string): asserts text {
    if (!this.isObjectIdentifier(text)) {
      throw new TypeError("Argument 'text' value doesn't match to OBJECT_IDENTIFIER requirements");
    }
  }

  public static toString(source: BufferSource): string {
    const view = BufferSourceConverter.toUint8Array(source);
    const subIdentifiers: number[] = [];

    let offset = 0;
    for (let i = 0; i < view.length; i++) {
      const octet = view[i];
      if (octet & 0x80) {
        continue;
      }

      const subIdentifier = view.subarray(offset, i + 1)
        .map(o => o & 0x7F);
      const value = Utils.toBase(subIdentifier, 7);
      if (!offset) {
        if (value < 40) {
          subIdentifiers.push(0);
          subIdentifiers.push(value);
        } else if (value < 80) {
          subIdentifiers.push(1);
          subIdentifiers.push(value - 40);
        } else {
          subIdentifiers.push(2);
          subIdentifiers.push(value - 80);
        }
      } else {
        subIdentifiers.push(value);
      }
      offset = i + 1;
    }

    return subIdentifiers.map(o => o.toString(10)).join(".");
  }

  public static fromString(text: string): Uint8Array {
    this.assert(text);

    const subIdentifiers = text.split(".").map(o => +o);
    const writer = new ViewWriter();

    // Encode the fist sub-identifier
    const value = subIdentifiers[0] * 40 + subIdentifiers[1];
    const view = Utils.fromBase(value, 7).map(Utils.enableLastBit);
    writer.write(view);

    // Encode others sub-identifiers
    for (let i = 2; i < subIdentifiers.length; i++) {
      const view = Utils.fromBase(subIdentifiers[i], 7).map(Utils.enableLastBit);
      writer.write(view);
    }

    return writer.toUint8Array();
  }
}

@universal(6)
export class AsnObjectIdentifier extends AsnObject {

  public static override readonly BER_IDENTIFIER = new Uint8Array([0x06]);
  public static readonly NAME = "OBJECT IDENTIFIER";

  public readonly name: typeof AsnObjectIdentifier.NAME = AsnObjectIdentifier.NAME;

  constructor(value?: string) {
    super();

    if (value !== undefined) {
      this.value = value;
    }
  }

  public get value(): string {
    return ObjectIdentifierConverter.toString(this.content.view);
  }

  public set value(value: string) {
    this.content.view = ObjectIdentifierConverter.fromString(value);
  }

  protected override toAsnString(): string {
    return `${this.name} ${this.value}`;
  }

}

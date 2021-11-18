import { Convert, TextEncoding } from "pvtsutils";
import { AsnObject } from "./Object";

export abstract class AsnString extends AsnObject {

  public static readonly ENCODING: TextEncoding = "ascii";

  public readonly encoding: TextEncoding;

  public constructor(value?: string) {
    super();

    this.encoding = (this.constructor as typeof AsnString).ENCODING;

    if (value !== undefined) {
      this.value = value;
    }
  }

  public get value(): string {
    return Convert.ToUtf8String(this.content.view, this.encoding);
  }

  public set value(value: string) {
    const array = Convert.FromUtf8String(value, this.encoding);
    this.content.view = new Uint8Array(array);
  }

  protected toAsnString(): string {
    return `${this.name} '${this.value}'`;
  }

}

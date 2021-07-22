import { ASNObject } from "./Object";

export class ASNBoolean extends ASNObject {

  public static override readonly DEFAULT_BER_IDENTIFIER = new Uint8Array([0x01]);

  constructor(value?: boolean) {
    super();

    this.content.view = new Uint8Array(1);

    if (value !== undefined) {
      this.content.view = new Uint8Array([+value]);
    }
  }

  public get value(): boolean {
    return !!this.content.view[0];
  }

  public set value(value: boolean) {
    this.content.view[0] = +value;
  }

}

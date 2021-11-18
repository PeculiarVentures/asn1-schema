import { Convert } from "pvtsutils";
import { Utils } from "..";
import { AsnString } from "./String";
import { universal } from "./Types";

@universal(28)
export class AsnUniversalString extends AsnString {

  public static override readonly BER_IDENTIFIER = new Uint8Array([0x1c]);
  public static readonly NAME = "UniversalString";

  public readonly name: typeof AsnUniversalString.NAME = AsnUniversalString.NAME;

  public override get value(): string {
    const view = this.content.view.slice();
    for (let i = 0; i < view.length; i += 4) {
      view[i] = view[i + 3];
      view[i + 1] = view[i + 2];
      view[i + 2] = 0x00;
      view[i + 3] = 0x00;
    }

    return String.fromCharCode.apply(null, new Uint32Array(view.buffer) as any);
  }

  public override set value(value: string) {
    const length = value.length;

    const view = new Uint8Array(length * 4);

    for (let i = 0; i < length; i++) {
      const codeBuf = Utils.fromBase(value.charCodeAt(i), 8);
      const codeView = codeBuf;
      if (codeView.length > 4) {
        continue;
      }

      const dif = 4 - codeView.length;

      for (let j = (codeView.length - 1); j >= 0; j--) {
        view[i * 4 + j + dif] = codeView[j];
      }
    }

    this.content.view = view;
  }
}

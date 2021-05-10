import { BERIdentifierOctets } from "./BERIdentifierOctets";
import { BERLengthOctets } from "./BERLengthOctets";
import { ViewObject } from "../ViewObject";
import { BERContentOctets, IBERObject } from "./BERContentOctets";

export class BERObject extends ViewObject implements IBERObject {
  public identifier = new BERIdentifierOctets();
  public length = new BERLengthOctets();
  public content = new BERContentOctets();

  public hasChanged(): boolean {
    const identifier = this.identifier.view.buffer;
    const length = this.length.view.buffer;
    const content = this.content.view.buffer;

    if (identifier.byteLength
      && identifier === length) {
      if (content.byteLength && content !== identifier) {
        return true;
      }

      if (this.identifier.constructed) {
        for (const child of this.content.items) {
          if (child.hasChanged()) {
            return true;
          }
        }
      }
      return false;
    }
    return true;
  }
}

import { BEROctets } from "./BEROctets";
import { ViewReader } from "../ViewReader";
import { BufferSource } from "pvtsutils";
import { BERIdentifierOctets } from "./BERIdentifierOctets";
import { BERLengthOctets, BERLengthType } from "./BERLengthOctets";

export interface IBERObject {
  view: Uint8Array;
  identifier: BERIdentifierOctets;
  length: BERLengthOctets;
  content: BERContentOctets;
  hasChanged(): boolean;
}

export type BERParseHandler = (data: BufferSource | ViewReader) => IBERObject;

export class BERContentOctets extends BEROctets {

  public fromBER(data: BufferSource | ViewReader, identifier: BERIdentifierOctets, length: BERLengthOctets, handler: BERParseHandler): void {
    super.fromBER(data, identifier, length, handler);
  }

  protected onFromBER(reader: ViewReader, identifier: BERIdentifierOctets, length: BERLengthOctets, handler: BERParseHandler): void {
    // read content
    if (identifier.constructed) {
      if (length.type === BERLengthType.indefinite) {
        while (true) {
          const item = handler(reader);
          this.items.push(item);

          if (!reader.getByte() && !reader.getByte()) {
            // The end-of-contents octets shall consist of two zero octets.
            break;
          }
        }
      } else {
        const subReader = new ViewReader(reader.readBytes(length.value));
        while (subReader.position !== subReader.length) {
          const item = handler(subReader);
          this.items.push(item);
        }
      }
    } else {
      if (length.type === BERLengthType.indefinite) {
        throw new Error("Primitive cannot use indefinite form of length");
      }
      reader.readBytes(length.value);
    }
  }
  public items: IBERObject[] = [];
}

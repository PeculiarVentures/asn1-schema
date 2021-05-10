import { BufferSource } from "pvtsutils";
import { BERIdentifierOctets } from "./BERIdentifierOctets";
import { BERLengthOctets, BERLengthType } from "./BERLengthOctets";
import { ViewReader } from "../ViewReader";
import { BERObject } from "./BERObject";
import { BERContentOctets } from "./BERContentOctets";
import { ViewWriter } from "../ViewWriter";

export class BERConverter {

  public static serialize(object: BERObject): ArrayBuffer;
  public static serialize(object: BERObject, writer: ViewWriter): void;
  public static serialize(object: BERObject, writer?: ViewWriter): ArrayBuffer | void {
    if (writer) {
      if (!object.hasChanged()) {
        writer.write(object.view);
      } else {
        // compute content length
        const contentWriter = new ViewWriter();

        if (object.identifier.constructed) {
          for (const child of object.content.items) {
            this.serialize(child, contentWriter);
          }
        } else {
          contentWriter.write(object.content.view);
        }

        // write identifier octets
        writer.write(object.identifier.view);
        // write length octets
        object.length.value = contentWriter.length;
        writer.write(object.length.view);
        // write content octet
        writer.writeStream(contentWriter);
      }
    } else {
      const writer = new ViewWriter();
      this.serialize(object, writer);

      return writer.toArrayBuffer();
    }
  }

  public static parse(data: BufferSource | ViewReader): BERObject;
  public static parse<T extends BERObject>(data: BufferSource | ViewReader, type: new () => T): T;
  public static parse(data: BufferSource | ViewReader, type?: new () => BERObject): BERObject {
    if (!(data instanceof ViewReader)) {
      data = new ViewReader(data);
    }

    const res = this.onParse(data);

    if (type) {
      if (!(res instanceof type)) {
        throw new TypeError("Returning object doesn't match to requested type");
      }
    }

    return res;
  }

  protected static onParse(reader: ViewReader) {
    const start = reader.position;

    const identifier = BERIdentifierOctets.fromBER(reader);
    const length = BERLengthOctets.fromBER(reader);
    const content = BERContentOctets.fromBER(reader, identifier, length, this.parse.bind(this));

    if (length.type === BERLengthType.indefinite) {
      // Skip two zero bytes for indefinite form
      reader.skip(2);
    }

    // Create BER structure
    const berType = this.onBeforeObjectInit(identifier);
    const result = new berType();
    result.identifier = identifier;
    result.length = length;
    result.content = content;
    result.view = reader.subarray(start, start + reader.position);

    this.onAfterObjectInit(result);

    return result;
  }

  protected static onBeforeObjectInit(id: BERIdentifierOctets): typeof BERObject {
    return BERObject;
  }

  protected static onAfterObjectInit(object: BERObject): void {
  }

}

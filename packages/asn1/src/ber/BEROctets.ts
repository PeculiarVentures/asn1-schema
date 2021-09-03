import { BufferSource } from "pvtsutils";
import { ViewObject } from "../ViewObject";
import { ViewReader } from "../ViewReader";

export abstract class BEROctets extends ViewObject {

  public static fromBER<T extends BEROctets>(this: new () => T, data: BufferSource | ViewReader, ...args: any[]): T {
    const res = new this();
    res.fromBER(data, ...args);

    return res;
  }

  public fromBER(data: BufferSource | ViewReader, ...args: any[]): void {
    if (!(data instanceof ViewReader)) {
      data = new ViewReader(data);
    }
    const start = data.position;
    try {
      this.onFromBER(data, ...args);
    } catch (e) {
      const message = `BER parsing error at position ${data.position}.`;
      if (e instanceof Error) {
        e.message = `${message} ${e.message}`;
        throw e;
      }

      throw new Error(message);
    }

    this.view = data.subarray(start, data.position);
  }
  /**
   * Reads data from the reader and initializes object values
   * @param reader
   */
  protected abstract onFromBER(reader: ViewReader, ...args: any[]): void;
}

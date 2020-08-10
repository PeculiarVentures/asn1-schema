export abstract class AsnArray<T> extends Array<T> {
  constructor(items: T[] = []) {
    if (typeof items === "number") {
      super(items);
    } else {
      super();
      for (const item of items) {
        this.push(item);
      }
    }
    
    // Set the prototype explicitly.
    // Object.setPrototypeOf(this, AsnArray.prototype);
  }
}

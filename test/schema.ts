import * as assert from "assert";
import { schemaStorage } from "../src/storage";
import { AsnProp, AsnPropTypes } from "../src";

context("Schema", () => {
  it("extending", () => {
    class Parent {
      @AsnProp({ type: AsnPropTypes.Integer })
      public value = 1;
    }
    class Child extends Parent {
      @AsnProp({ type: AsnPropTypes.Utf8String })
      public name = "test";
    }
    const parentSchema = schemaStorage.get(Parent);
    const childSchema = schemaStorage.get(Child);
    assert.equal(Object.keys(parentSchema.items).length, 1);
    assert.equal(Object.keys(childSchema.items).length, 2);
  });
  it("throw error on a non-existent schema", () => {
    class Parent {
      public value = 1;
    }
    assert.throws(() => {
      schemaStorage.get(Parent);
    });
  });
});

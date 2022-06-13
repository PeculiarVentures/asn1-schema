import * as assert from "assert";
import { AsnConvert, AsnProp, AsnPropTypes, AsnType, AsnTypeTypes } from "../src";
import { schemaStorage } from "../src/storage";

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
    assert.strictEqual(Object.keys(parentSchema.items).length, 1);
    assert.strictEqual(Object.keys(childSchema.items).length, 2);
  });
  it("throw error on a non-existent schema", () => {
    class Parent {
      public value = 1;
    }
    assert.throws(() => {
      schemaStorage.get(Parent);
    });
  });

  it("Null valueBlock does not have toBER", () => {
    // see PR https://github.com/PeculiarVentures/asn1-schema/pull/44

    @AsnType({ type: AsnTypeTypes.Choice })
    class CertStatus {

      @AsnProp({
        type: AsnPropTypes.Null,
        context: 0,
        implicit: true,
      })
      good!: null;

      @AsnProp({
        type: AsnPropTypes.Any,
        context: 1,
        implicit: true,
      })
      revoked!: ArrayBuffer;

      @AsnProp({
        type: AsnPropTypes.Any,
        context: 2,
        implicit: true,
      })
      unknown!: ArrayBuffer;
    }

    const asn = new CertStatus();
    asn.good = null;

    const raw = AsnConvert.serialize(asn);
    assert.strictEqual(Buffer.from(raw).toString("hex"), "8000");

    const asnParsed = AsnConvert.parse(raw, CertStatus);

    assert.strictEqual(asn.good, null);
  });

  it.skip("empty sequence", () => {
    class Test {
      @AsnProp({type: AsnPropTypes.Boolean, repeated: "sequence", optional: true,})
      public items?: boolean[];
    }

    const asn = AsnConvert.parse(Buffer.from("30023000", "hex"), Test);
    assert.ok(asn.items); // TODO It throws exception. Looks like asn1js doesn't assign empty structures to schema
  })

});

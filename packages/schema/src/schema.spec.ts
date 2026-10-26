import { describe, expect, it } from "vitest";
import { AsnConvert, AsnProp, AsnPropTypes, AsnType, AsnTypeTypes } from "./index";
import { schemaStorage } from "./storage";

describe("Schema", () => {
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
    expect(Object.keys(parentSchema.items).length).toBe(1);
    expect(Object.keys(childSchema.items).length).toBe(2);
  });
  it("throw error on a non-existent schema", () => {
    class Parent {
      public value = 1;
    }
    expect(() => {
      schemaStorage.get(Parent);
    }).toThrow();
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
    expect(Buffer.from(raw).toString("hex")).toBe("8000");

    AsnConvert.parse(raw, CertStatus);

    expect(asn.good).toBe(null);
  });

  it.skip("empty sequence", () => {
    class Test {
      @AsnProp({
        type: AsnPropTypes.Boolean,
        repeated: "sequence",
        optional: true,
      })
      public items?: boolean[];
    }

    const asn = AsnConvert.parse(Buffer.from("30023000", "hex"), Test);
    expect(asn.items).toBeTruthy(); // TODO It throws exception. Looks like asn1js doesn't assign empty structures to schema
  });
});

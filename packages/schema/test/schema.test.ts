import { describe, it, assert } from "vitest";
import { AsnConvert, AsnProp, AsnPropTypes, AsnType, AsnTypeTypes } from "../src";
import { schemaStorage } from "../src/storage";

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

    AsnConvert.parse(raw, CertStatus);

    assert.strictEqual(asn.good, null);
  });

  it.skip("empty sequence", () => {
    class Test {
      @AsnProp({ type: AsnPropTypes.Boolean, repeated: "sequence", optional: true })
      public items?: boolean[];
    }

    const asn = AsnConvert.parse(Buffer.from("30023000", "hex"), Test);
    assert.ok(asn.items); // TODO It throws exception. Looks like asn1js doesn't assign empty structures to schema
  });

  describe("Parse", () => {
    describe("CHOICE", () => {
      @AsnType({ type: AsnTypeTypes.Choice })
      class BasicChoice {
        @AsnProp({ type: AsnPropTypes.Integer })
        public int?: number;

        @AsnProp({ type: AsnPropTypes.Utf8String })
        public str?: string;
      }

      it("should parse CHOICE with UTF8String", () => {
        const asn1 = AsnConvert.parse(Buffer.from("0c03616263", "hex"), BasicChoice);
        assert.strictEqual(asn1.str, "abc");
      });

      it("should parse CHOICE with Integer", () => {
        const asn1 = AsnConvert.parse(Buffer.from("0203010203", "hex"), BasicChoice);
        assert.strictEqual(asn1.int, 0x010203);
      });

      @AsnType({ type: AsnTypeTypes.Choice })
      class ExtendedChoice {
        @AsnProp({ type: AsnPropTypes.Boolean })
        public bool?: boolean;

        @AsnProp({ type: AsnPropTypes.Integer })
        public int?: number;

        @AsnProp({ type: AsnPropTypes.Utf8String })
        public str?: string;

        @AsnProp({ type: AsnPropTypes.OctetString })
        public octets?: ArrayBuffer;

        @AsnProp({ type: AsnPropTypes.ObjectIdentifier })
        public oid?: string;
      }

      it("should parse CHOICE with Boolean true", () => {
        const asn1 = AsnConvert.parse(Buffer.from("0101ff", "hex"), ExtendedChoice);
        assert.strictEqual(asn1.bool, true);
      });

      it("should parse CHOICE with Boolean false", () => {
        const asn1 = AsnConvert.parse(Buffer.from("010100", "hex"), ExtendedChoice);
        assert.strictEqual(asn1.bool, false);
      });

      it("should parse CHOICE with large Integer", () => {
        const asn1 = AsnConvert.parse(Buffer.from("020400ffffff", "hex"), ExtendedChoice);
        assert.strictEqual(asn1.int, 0xffffff);
      });

      it("should parse CHOICE with negative Integer", () => {
        const asn1 = AsnConvert.parse(Buffer.from("0202ff00", "hex"), ExtendedChoice);
        assert.strictEqual(asn1.int, -256);
      });

      it("should parse CHOICE with empty UTF8String", () => {
        const asn1 = AsnConvert.parse(Buffer.from("0c00", "hex"), ExtendedChoice);
        assert.strictEqual(asn1.str, "");
      });

      it("should parse CHOICE with Unicode UTF8String", () => {
        const asn1 = AsnConvert.parse(
          Buffer.from("0c0b48656c6c6f20576f726c64", "hex"),
          ExtendedChoice,
        );
        assert.strictEqual(asn1.str, "Hello World");
      });

      it("should parse CHOICE with OctetString", () => {
        const asn1 = AsnConvert.parse(Buffer.from("0404deadbeef", "hex"), ExtendedChoice);
        assert.ok(asn1.octets);
        const bytes = new Uint8Array(asn1.octets as ArrayBuffer);
        assert.deepStrictEqual(Array.from(bytes), [0xde, 0xad, 0xbe, 0xef]);
      });

      it("should parse CHOICE with ObjectIdentifier", () => {
        const asn1 = AsnConvert.parse(Buffer.from("06032b0601", "hex"), ExtendedChoice);
        assert.strictEqual(asn1.oid, "1.3.6.1");
      });

      @AsnType({ type: AsnTypeTypes.Choice })
      class TaggedChoice {
        @AsnProp({ type: AsnPropTypes.Integer, context: 0, implicit: true })
        public int?: number;

        @AsnProp({ type: AsnPropTypes.Utf8String, context: 1, implicit: true })
        public str?: string;

        @AsnProp({ type: AsnPropTypes.Boolean, context: 2 })
        public bool?: boolean;
      }

      it("should parse CHOICE with implicit context-specific Integer", () => {
        const asn1 = AsnConvert.parse(Buffer.from("80020100", "hex"), TaggedChoice);
        assert.strictEqual(asn1.int, 256);
      });

      it("should parse CHOICE with implicit context-specific UTF8String", () => {
        const asn1 = AsnConvert.parse(Buffer.from("810474657374", "hex"), TaggedChoice);
        assert.strictEqual(asn1.str, "test");
      });

      it("should parse CHOICE with explicit context-specific Boolean", () => {
        const asn1 = AsnConvert.parse(Buffer.from("a2030101ff", "hex"), TaggedChoice);
        assert.strictEqual(asn1.bool, true);
      });

      @AsnType({ type: AsnTypeTypes.Choice })
      class TimeChoice {
        @AsnProp({ type: AsnPropTypes.UTCTime })
        public utcTime?: Date;

        @AsnProp({ type: AsnPropTypes.GeneralizedTime })
        public generalizedTime?: Date;
      }

      it("should parse CHOICE with UTCTime", () => {
        const asn1 = AsnConvert.parse(
          Buffer.from("170d3233303631323132333435365a", "hex"),
          TimeChoice,
        );
        assert.ok(asn1.utcTime instanceof Date);
        assert.strictEqual(asn1.utcTime?.getUTCFullYear(), 2023);
        assert.strictEqual(asn1.utcTime?.getUTCMonth(), 5); // June (0-based)
        assert.strictEqual(asn1.utcTime?.getUTCDate(), 12);
      });

      it("should parse CHOICE with GeneralizedTime", () => {
        const asn1 = AsnConvert.parse(
          Buffer.from("180f32303138303932313230303332345a", "hex"),
          TimeChoice,
        );
        assert.ok(asn1.generalizedTime instanceof Date);
        assert.strictEqual(asn1.generalizedTime?.getUTCFullYear(), 2018);
        assert.strictEqual(asn1.generalizedTime?.getUTCMonth(), 8); // September (0-based)
        assert.strictEqual(asn1.generalizedTime?.getUTCDate(), 21);
      });

      @AsnType({ type: AsnTypeTypes.Choice })
      class StringChoice {
        @AsnProp({ type: AsnPropTypes.PrintableString })
        public printable?: string;

        @AsnProp({ type: AsnPropTypes.IA5String })
        public ia5?: string;

        @AsnProp({ type: AsnPropTypes.NumericString })
        public numeric?: string;

        @AsnProp({ type: AsnPropTypes.VisibleString })
        public visible?: string;
      }

      it("should parse CHOICE with PrintableString", () => {
        const asn1 = AsnConvert.parse(Buffer.from("130548656c6c6f", "hex"), StringChoice);
        assert.strictEqual(asn1.printable, "Hello");
      });

      it("should parse CHOICE with IA5String", () => {
        const asn1 = AsnConvert.parse(Buffer.from("160568656c6c6f", "hex"), StringChoice);
        assert.strictEqual(asn1.ia5, "hello");
      });

      it("should parse CHOICE with NumericString", () => {
        const asn1 = AsnConvert.parse(Buffer.from("120431323334", "hex"), StringChoice);
        assert.strictEqual(asn1.numeric, "1234");
      });

      it("should parse CHOICE with VisibleString", () => {
        const asn1 = AsnConvert.parse(Buffer.from("1a0454657374", "hex"), StringChoice);
        assert.strictEqual(asn1.visible, "Test");
      });
    });

    describe("SEQUENCE", () => {
      @AsnType({ type: AsnTypeTypes.Sequence })
      class BasicSequence {
        @AsnProp({ type: AsnPropTypes.Integer })
        public version!: number;

        @AsnProp({ type: AsnPropTypes.Utf8String })
        public name!: string;
      }

      it("should parse SEQUENCE with required fields", () => {
        const asn1 = AsnConvert.parse(
          Buffer.from("300a0201010c0548656c6c6f", "hex"),
          BasicSequence,
        );
        assert.strictEqual(asn1.version, 1);
        assert.strictEqual(asn1.name, "Hello");
      });

      @AsnType({ type: AsnTypeTypes.Sequence })
      class OptionalSequence {
        @AsnProp({ type: AsnPropTypes.Integer })
        public version!: number;

        @AsnProp({ type: AsnPropTypes.Utf8String, optional: true })
        public name?: string;

        @AsnProp({ type: AsnPropTypes.Boolean, optional: true })
        public active?: boolean;
      }

      it("should parse SEQUENCE with optional fields present", () => {
        const asn1 = AsnConvert.parse(
          Buffer.from("300d0201010c0548656c6c6f0101ff", "hex"),
          OptionalSequence,
        );
        assert.strictEqual(asn1.version, 1);
        assert.strictEqual(asn1.name, "Hello");
        assert.strictEqual(asn1.active, true);
      });

      it("should parse SEQUENCE with optional fields absent", () => {
        const asn1 = AsnConvert.parse(Buffer.from("3003020101", "hex"), OptionalSequence);
        assert.strictEqual(asn1.version, 1);
        assert.strictEqual(asn1.name, undefined);
        assert.strictEqual(asn1.active, undefined);
      });

      @AsnType({ type: AsnTypeTypes.Sequence })
      class ComplexSequence {
        @AsnProp({ type: AsnPropTypes.Integer })
        public id!: number;

        @AsnProp({ type: AsnPropTypes.Utf8String })
        public title!: string;

        @AsnProp({ type: AsnPropTypes.OctetString })
        public data!: ArrayBuffer;

        @AsnProp({ type: AsnPropTypes.Boolean, optional: true })
        public enabled?: boolean;
      }

      it("should parse SEQUENCE with complex types", () => {
        const asn1 = AsnConvert.parse(
          Buffer.from("30130201010c0548656c6c6f0404deadbeef0101ff", "hex"),
          ComplexSequence,
        );
        assert.strictEqual(asn1.id, 1);
        assert.strictEqual(asn1.title, "Hello");
        const dataBytes = new Uint8Array(asn1.data);
        assert.deepStrictEqual(Array.from(dataBytes), [0xde, 0xad, 0xbe, 0xef]);
        assert.strictEqual(asn1.enabled, true);
      });

      @AsnType({ type: AsnTypeTypes.Sequence })
      class NestedSequence {
        @AsnProp({ type: AsnPropTypes.Integer })
        public version!: number;

        @AsnProp({ type: AsnPropTypes.Utf8String })
        public author!: string;

        @AsnProp({ type: AsnPropTypes.UTCTime })
        public created!: Date;
      }

      it("should parse SEQUENCE with nested SEQUENCE", () => {
        const asn1 = AsnConvert.parse(
          Buffer.from("30180201010c044a6f686e170d3233303631323132333435365a", "hex"),
          NestedSequence,
        );
        assert.strictEqual(asn1.version, 1);
        assert.strictEqual(asn1.author, "John");
        assert.ok(asn1.created instanceof Date);
        assert.strictEqual(asn1.created.getUTCFullYear(), 2023);
      });

      @AsnType({ type: AsnTypeTypes.Sequence })
      class TaggedSequence {
        @AsnProp({ type: AsnPropTypes.Integer, context: 0, implicit: true })
        public id!: number;

        @AsnProp({ type: AsnPropTypes.Utf8String, context: 1, implicit: true })
        public name!: string;

        @AsnProp({ type: AsnPropTypes.Boolean, context: 2 })
        public active!: boolean;
      }

      it("should parse SEQUENCE with implicit context-specific tags", () => {
        const asn1 = AsnConvert.parse(
          Buffer.from("300d8001018103486921a2030101ff", "hex"),
          TaggedSequence,
        );
        assert.strictEqual(asn1.id, 1);
        assert.strictEqual(asn1.name, "Hi!");
        assert.strictEqual(asn1.active, true);
      });

      @AsnType({ type: AsnTypeTypes.Sequence })
      class DefaultValueSequence {
        @AsnProp({ type: AsnPropTypes.Integer, defaultValue: 42 })
        public value!: number;

        @AsnProp({ type: AsnPropTypes.Utf8String, optional: true })
        public comment?: string;
      }

      it("should parse SEQUENCE with default values", () => {
        const asn1 = AsnConvert.parse(Buffer.from("3000", "hex"), DefaultValueSequence);
        assert.strictEqual(asn1.value, 42);
        assert.strictEqual(asn1.comment, undefined);
      });

      @AsnType({ type: AsnTypeTypes.Sequence })
      class ArraySequence {
        @AsnProp({ type: AsnPropTypes.Integer })
        public count!: number;

        @AsnProp({ type: AsnPropTypes.Boolean, repeated: "sequence" })
        public flags!: boolean[];
      }

      it("should parse SEQUENCE with repeated fields", () => {
        const asn1 = AsnConvert.parse(
          Buffer.from("300b02010130060101ff010100", "hex"),
          ArraySequence,
        );
        assert.strictEqual(asn1.count, 1);
        assert.deepStrictEqual(asn1.flags, [true, false]);
      });

      @AsnType({ type: AsnTypeTypes.Sequence })
      class MixedTypesSequence {
        @AsnProp({ type: AsnPropTypes.ObjectIdentifier })
        public oid!: string;

        @AsnProp({ type: AsnPropTypes.BitString })
        public bits!: ArrayBuffer;

        @AsnProp({ type: AsnPropTypes.Null })
        public marker!: null;
      }

      it("should parse SEQUENCE with mixed ASN.1 types", () => {
        const asn1 = AsnConvert.parse(
          Buffer.from("300b06032b0601030201000500", "hex"),
          MixedTypesSequence,
        );
        assert.strictEqual(asn1.oid, "1.3.6.1");
        // BitString converter returns raw bytes as ArrayBuffer (without the unusedBits prefix)
        const bitBytes = new Uint8Array(asn1.bits);
        assert.deepStrictEqual(Array.from(bitBytes), [0x00]);
        assert.strictEqual(asn1.marker, null);
      });

      @AsnType({ type: AsnTypeTypes.Sequence })
      class ChildSequence {
        @AsnProp({ type: AsnPropTypes.OctetString })
        public data!: ArrayBuffer;
      }

      @AsnType({ type: AsnTypeTypes.Sequence })
      class ParentSequence {
        @AsnProp({ type: AsnPropTypes.Integer })
        public id!: number;

        @AsnProp({ type: ChildSequence })
        public child!: ChildSequence;
      }

      it("should parse SEQUENCE with child SEQUENCE", () => {
        const asn1 = AsnConvert.parse(
          Buffer.from("300b02010130060404deadbeef", "hex"),
          ParentSequence,
        );
        assert.strictEqual(asn1.id, 1);
        assert.ok(asn1.child instanceof ChildSequence);
        const dataBytes = new Uint8Array(asn1.child.data);
        assert.deepStrictEqual(Array.from(dataBytes), [0xde, 0xad, 0xbe, 0xef]);
      });
    });
  });
});

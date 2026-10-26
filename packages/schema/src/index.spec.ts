import { describe, expect, it } from "vitest";
import * as asn1js from "asn1js";
import type { BufferSourceLike } from "@peculiar/utils";
import * as src from "./index";

function assertBuffer(actual: Buffer, expected: Buffer): void {
  expect(Buffer.compare(actual, expected), `Buffers are not equal.\n\tActual:   ${actual.toString("hex")}\n\tExpected: ${expected.toString("hex")}`).toBe(0);
}

function test<T>(cls: new () => { value: T }, hex: string, expected: T, assertCb?: (value: T, excepted: T) => void): void {
  it("serialize", () => {
    const obj = new cls();
    obj.value = expected;
    const res = Buffer.from(src.AsnSerializer.serialize(obj));
    assertBuffer(res, Buffer.from(hex, "hex"));
  });
  it("parse", () => {
    const obj = src.AsnParser.parse(new Uint8Array(Buffer.from(hex, "hex")).buffer, cls);
    // console.log(obj);
    if (assertCb) {
      assertCb(obj.value, expected);
    } else {
      expect(obj.value).toBe(expected);
    }
  });
}

describe("Test", () => {
  describe("Default value", () => {
    class Test {
      @src.AsnProp({
        type: src.AsnPropTypes.Integer,
        defaultValue: 0,
      })
      public version = 0;
    }
    describe("serialize", () => {
      it("not equal to default", () => {
        const obj = new Test();
        obj.version = 1;

        const res = Buffer.from(src.AsnSerializer.serialize(obj));
        assertBuffer(res, Buffer.from([48, 3, 2, 1, 1]));
      });
      it("equal to default", () => {
        const obj = new Test();
        obj.version = 0;

        const res = Buffer.from(src.AsnSerializer.serialize(obj));
        assertBuffer(res, Buffer.from("3000", "hex"));
      });
    });
  });

  describe("CHOICE", () => {
    describe("CONTEXT-SPECIFIC", () => {
      class Child {
        @src.AsnProp({ type: src.AsnPropTypes.Integer })
        public value = 2;

        @src.AsnProp({ type: src.AsnPropTypes.Utf8String })
        public text = "test";
      }

      @src.AsnType({ type: src.AsnTypeTypes.Choice })
      class Test {
        @src.AsnProp({
          type: src.AsnPropTypes.OctetString,
          context: 0,
          implicit: true,
        })
        public select1?: ArrayBuffer;

        @src.AsnProp({
          type: src.AsnPropTypes.Utf8String,
          context: 1,
        })
        public select2?: string;

        @src.AsnProp({
          type: src.AsnPropTypes.Integer,
          context: 2,
        })
        public select3?: number;

        @src.AsnProp({
          type: Child,
          context: 3,
          implicit: true,
        })
        public select4?: Child;
      }
      describe("EXPLICIT", () => {
        it("serialize", () => {
          const obj = new Test();
          obj.select2 = "test";
          const buf = src.AsnSerializer.serialize(obj);
          assertBuffer(Buffer.from(buf), Buffer.from("a1060c0474657374", "hex"));
        });
        it("parse", () => {
          const obj = src.AsnParser.parse(Buffer.from("a1060c0474657374", "hex"), Test);
          expect(obj.select2).toBe("test");
        });
      });
      describe("IMPLICIT", () => {
        describe("Primitive", () => {
          it("serialize", () => {
            const obj = new Test();
            obj.select1 = new Uint8Array([1, 2, 3, 4, 5]).buffer;
            const buf = src.AsnSerializer.serialize(obj);
            assertBuffer(Buffer.from(buf), Buffer.from("80050102030405", "hex"));
          });
          it("parse", () => {
            const obj = src.AsnParser.parse(new Uint8Array(Buffer.from("80050102030405", "hex")).buffer, Test);
            expect(obj.select1).toBeTruthy();
            expect(obj.select1!.byteLength).toBe(5);
          });
        });
        describe("Repeated SET", () => {
          class Test2 {
            @src.AsnProp({
              type: src.AsnPropTypes.Integer,
              repeated: "set",
              implicit: true,
              context: 1,
            })
            public items: number[] = [];
          }
          const testHex = "3011a10f020101020102020103020104020105";

          it("serialize", () => {
            const obj = new Test2();
            obj.items = [1, 2, 3, 4, 5];
            const buf = src.AsnSerializer.serialize(obj);
            assertBuffer(Buffer.from(buf), Buffer.from(testHex, "hex"));
          });
          it("parse", () => {
            const obj = src.AsnParser.parse(new Uint8Array(Buffer.from(testHex, "hex")).buffer, Test2);
            expect(obj.items.join("")).toBe("12345");
          });
        });
        describe("Repeated SEQUENCE", () => {
          class Test2 {
            @src.AsnProp({
              type: src.AsnPropTypes.Integer,
              repeated: "sequence",
              implicit: true,
              context: 1,
            })
            public items: number[] = [];
          }
          const testHex = "3011a10f020101020102020103020104020105";

          it("serialize", () => {
            const obj = new Test2();
            obj.items = [1, 2, 3, 4, 5];
            const buf = src.AsnSerializer.serialize(obj);
            assertBuffer(Buffer.from(buf), Buffer.from(testHex, "hex"));
          });
          it("parse", () => {
            const obj = src.AsnParser.parse(new Uint8Array(Buffer.from(testHex, "hex")).buffer, Test2);
            expect(obj.items.join("")).toBe("12345");
          });
        });
        describe("Constructed", () => {
          const der = Buffer.from("a3090201020c0474657374", "hex");
          it("stringify", () => {
            const obj = new Test();
            obj.select4 = new Child();

            const buf = src.AsnSerializer.serialize(obj);
            expect(Buffer.from(buf).toString("hex")).toBe(der.toString("hex"));
          });
          it("parse", () => {
            const obj = src.AsnParser.parse(new Uint8Array(der).buffer, Test);
            expect(!!obj.select4).toBe(true);
            expect(obj.select4).toBeTruthy();
            expect(obj.select4!.text).toBe("test");
            expect(obj.select4!.value).toBe(2);
          });
        });
      });
    });

    describe("PRIMITIVES", () => {
      @src.AsnType({ type: src.AsnTypeTypes.Choice })
      class Choice {
        @src.AsnProp({ type: src.AsnPropTypes.Integer })
        public numValue!: number;

        @src.AsnProp({ type: src.AsnPropTypes.Boolean })
        public boolValue!: boolean;

        @src.AsnProp({ type: src.AsnPropTypes.ObjectIdentifier })
        public oidValue!: string;
      }
      it("serialize", () => {
        const obj = new Choice();
        obj.oidValue = "1.2.3";

        const res = Buffer.from(src.AsnSerializer.serialize(obj));
        assertBuffer(res, Buffer.from("06022a03", "hex"));
      });
      it("parse", () => {
        const obj = src.AsnParser.parse(new Uint8Array(Buffer.from("06022a03", "hex")).buffer, Choice);
        expect(obj.oidValue).toBe("1.2.3");
      });
    });

    it("throw error if choice doesn't have as min one value", () => {
      @src.AsnType({ type: src.AsnTypeTypes.Choice })
      class Test {
        @src.AsnProp({ type: src.AsnPropTypes.Integer })
        public case1?: number;

        @src.AsnProp({ type: src.AsnPropTypes.Utf8String })
        public case2?: string;
      }

      const obj1 = new Test();
      expect(() => {
        src.AsnSerializer.serialize(obj1);
      }).toThrow();
    });
  });

  describe("Converter", () => {
    describe("Default", () => {
      describe("IntegerConverter", () => {
        class Test {
          @src.AsnProp({ type: src.AsnPropTypes.Integer })
          public value!: string | number;
        }
        describe("Short number", () => {
          /**
           * SEQUENCE (1 elem)
           *   INTEGER 10
           */
          test(Test, "300302010a", 10);
        });
        describe("Big number", () => {
          /**
           * SEQUENCE (1 elem)
           *   INTEGER (47 bit) 123456789012345
           */
          test(Test, "300802067048860ddf79", "123456789012345");
        });
      });
      describe("BooleanConverter", () => {
        class Test {
          @src.AsnProp({ type: src.AsnPropTypes.Boolean })
          public value!: boolean;
        }
        /**
         * SEQUENCE (1 elem)
         *   BOOLEAN true
         */
        test(Test, "30030101ff", true);
      });
      describe("ObjectIdentifierConverter", () => {
        class Test {
          @src.AsnProp({ type: src.AsnPropTypes.ObjectIdentifier })
          public value!: string;
        }
        /**
         * SEQUENCE (1 elem)
         *   OBJECT IDENTIFIER 1.2.3.4.5
         */
        test(Test, "300606042a030405", "1.2.3.4.5");
      });
      describe("RelativeObjectIdentifierConverter", () => {
        class Test {
          @src.AsnProp({ type: src.AsnPropTypes.RelativeObjectIdentifier })
          public value!: string;
        }
        /**
         * SEQUENCE (1 elem)
         *   RELATIVE-OID 32473.1 -- draft-ietf-tls-trust-anchor-ids section 3
         */
        test(Test, "30060d0481fd5901", "32473.1");
      });
      describe("OctetStringConverter", () => {
        class Test {
          @src.AsnProp({ type: src.AsnPropTypes.OctetString })
          public value!: ArrayBuffer;
        }
        /**
         * SEQUENCE (1 elem)
         *   OCTET STRING (5 byte) 0102030405
         */
        test(Test, "300704050102030405", new Uint8Array([1, 2, 3, 4, 5]).buffer, (value, expected) => {
          assertBuffer(Buffer.from(value), Buffer.from(expected));
        });
      });
      describe("AnyConverter", () => {
        class Test {
          @src.AsnProp({ type: src.AsnPropTypes.Any })
          public value!: ArrayBuffer;
        }

        const value = new Uint8Array([2, 1, 3]).buffer; // INTEGER 3
        /**
         * SEQUENCE (1 elem)
         *   OCTET STRING (5 byte) 0102030405
         */
        test(Test, "3003020103", value, (value2, expected) => {
          assertBuffer(Buffer.from(value2), Buffer.from(expected));
        });
      });
      describe("EnumeratedConverter", () => {
        class Test {
          @src.AsnProp({ type: src.AsnPropTypes.Enumerated })
          public value!: number;
        }
        /**
         * SEQUENCE (1 elem)
         *   ENUMERATED
         */
        test(Test, "30030a0101", 1);
      });
      describe("Utf8StringConverter", () => {
        class Test {
          @src.AsnProp({ type: src.AsnPropTypes.Utf8String })
          public value!: string;
        }
        /**
         * SEQUENCE (1 elem)
         *   UTF8String My test text
         */
        test(Test, "300e0c0c4d7920746573742074657874", "My test text");
      });
      describe("BmpStringConverter", () => {
        class Test {
          @src.AsnProp({ type: src.AsnPropTypes.BmpString })
          public value!: string;
        }
        /**
         * SEQUENCE (1 elem)
         *   BMPString My test text
         */
        test(Test, "301a1e18004d00790020007400650073007400200074006500780074", "My test text");
      });
      describe("UniversalStringConverter", () => {
        class Test {
          @src.AsnProp({ type: src.AsnPropTypes.UniversalString })
          public value!: string;
        }
        /**
         * SEQUENCE (1 elem)
         *   Universal My test text
         */
        test(Test, "30321c300000004d0000007900000020000000740000006500000073000000740000002000000074000000650000007800000074", "My test text");
      });
      describe("NumericStringConverter", () => {
        class Test {
          @src.AsnProp({ type: src.AsnPropTypes.NumericString })
          public value!: string;
        }
        /**
         * SEQUENCE (1 elem)
         *   NumericString 12345
         */
        test(Test, "300712053132333435", "12345");
      });
      describe("PrintableStringConverter", () => {
        class Test {
          @src.AsnProp({ type: src.AsnPropTypes.PrintableString })
          public value!: string;
        }
        /**
         * SEQUENCE (1 elem)
         *   PrintableString My test text
         */
        test(Test, "300e130c4d7920746573742074657874", "My test text");
      });
      describe("TeletexStringConverter", () => {
        class Test {
          @src.AsnProp({ type: src.AsnPropTypes.TeletexString })
          public value!: string;
        }
        /**
         * SEQUENCE (1 elem)
         *   TeletexString My test text
         */
        test(Test, "300e140c4d7920746573742074657874", "My test text");
      });
      describe("VideotexStringConverter", () => {
        class Test {
          @src.AsnProp({ type: src.AsnPropTypes.VideotexString })
          public value!: string;
        }
        /**
         * SEQUENCE (1 elem)
         *   VideotexString My test text
         */
        test(Test, "300e150c4d7920746573742074657874", "My test text");
      });
      describe("IA5StringConverter", () => {
        class Test {
          @src.AsnProp({ type: src.AsnPropTypes.IA5String })
          public value!: string;
        }
        /**
         * SEQUENCE (1 elem)
         *   IA5String My test text
         */
        test(Test, "300e160c4d7920746573742074657874", "My test text");
      });
      describe("GraphicStringConverter", () => {
        class Test {
          @src.AsnProp({ type: src.AsnPropTypes.GraphicString })
          public value!: string;
        }
        /**
         * SEQUENCE (1 elem)
         *   GraphicString My test text
         */
        test(Test, "300e190c4d7920746573742074657874", "My test text");
      });
      describe("VisibleStringConverter", () => {
        class Test {
          @src.AsnProp({ type: src.AsnPropTypes.VisibleString })
          public value!: string;
        }
        /**
         * SEQUENCE (1 elem)
         *   VisibleString My test text
         */
        test(Test, "300e1a0c4d7920746573742074657874", "My test text");
      });
      describe("GeneralStringConverter", () => {
        class Test {
          @src.AsnProp({ type: src.AsnPropTypes.GeneralString })
          public value!: string;
        }
        /**
         * SEQUENCE (1 elem)
         *   GeneralString My test text
         */
        test(Test, "300e1b0c4d7920746573742074657874", "My test text");
      });
      describe("CharacterStringConverter", () => {
        class Test {
          @src.AsnProp({ type: src.AsnPropTypes.CharacterString })
          public value!: string;
        }
        /**
         * SEQUENCE (1 elem)
         *   CharacterString My test text
         */
        test(Test, "300e1d0c4d7920746573742074657874", "My test text");
      });
    });
    describe("Custom", () => {
      describe("IntegerArrayBufferConverter", () => {
        class Test {
          @src.AsnProp({
            type: src.AsnPropTypes.Integer,
            converter: src.AsnIntegerArrayBufferConverter,
          })
          public value!: ArrayBuffer;
        }
        /**
         * SEQUENCE (1 elem)
         *   INTEGER (89 bit) 311917102708983781990072578
         */
        test(Test, "300e020c010203040506070809000102", new Uint8Array([1, 2, 3, 4, 5, 6, 7, 8, 9, 0, 1, 2]).buffer, (value) => {
          assertBuffer(Buffer.from(value), Buffer.from("010203040506070809000102", "hex"));
        });
      });
    });
    describe("BigInt", () => {
      @src.AsnChoiceType()
      class Test {
        @src.AsnProp({
          type: src.AsnPropTypes.Integer,
          converter: src.AsnIntegerBigIntConverter,
        })
        public value!: bigint;
      }

      it("positive number", () => {
        const value = BigInt("5172094299709469602635084381097487");

        const test = new Test();
        test.value = value;

        const asn = src.AsnConvert.serialize(test);
        expect(Buffer.from(asn).toString("hex")).toBe("020f00ff010203040508090a0b0c0d0e0f");
      });

      it("negative number", () => {
        const value = BigInt("-123456");

        const test = new Test();
        test.value = value;

        const asn = src.AsnConvert.serialize(test);
        expect(Buffer.from(asn).toString("hex")).toBe("0203fe1dc0");
      });
    });
  });

  describe("Constructed type", () => {
    it("SEQUENCE ", () => {
      class Test {
        @src.AsnProp({ type: src.AsnPropTypes.Integer })
        public value = 1;
      }

      const obj1 = new Test();
      const der = src.AsnSerializer.serialize(obj1);
      expect(Buffer.from(der).toString("hex")).toBe("3003020101");

      const obj2 = src.AsnParser.parse(der, Test);
      expect(obj2.value).toBe(1);
    });
    it("SET", () => {
      @src.AsnType({ type: src.AsnTypeTypes.Set })
      class Test {
        @src.AsnProp({ type: src.AsnPropTypes.Integer })
        public value = 1;
      }

      const obj1 = new Test();
      const der = src.AsnSerializer.serialize(obj1);
      expect(Buffer.from(der).toString("hex")).toBe("3103020101");

      const obj2 = src.AsnParser.parse(der, Test);
      expect(obj2.value).toBe(1);
    });
    it("child schema ", () => {
      class TbsCertificate {
        public static VERSION = 0;

        @src.AsnProp({
          type: src.AsnPropTypes.Integer,
          defaultValue: TbsCertificate.VERSION,
          context: 0,
        })
        public version = 2;
      }

      class Certificate {
        @src.AsnProp({ type: TbsCertificate })
        public tbs = new TbsCertificate();
      }

      const cert = new Certificate();
      const buf = src.AsnSerializer.serialize(cert);
      /**
       * SEQUENCE (1 elem)
       *   SEQUENCE (1 elem)
       *     [0] (1 elem)
       *       INTEGER 2
       */
      assertBuffer(Buffer.from(buf), Buffer.from("30073005a003020102", "hex"));
    });
  });

  describe("CONTEXT-SPECIFIC", () => {
    describe("IMPLICIT", () => {
      class Test {
        @src.AsnProp({
          type: src.OctetString,
          context: 0,
          implicit: true,
        })
        public value = new src.OctetString();
      }

      it("serialize", () => {
        const obj = new Test();
        obj.value = new src.OctetString([1, 2, 3, 4, 5]);
        const buf = src.AsnSerializer.serialize(obj);
        assertBuffer(Buffer.from(buf), Buffer.from("300780050102030405", "hex"));
      });

      it("parse", () => {
        const obj = src.AsnParser.parse(new Uint8Array(Buffer.from("300780050102030405", "hex")).buffer, Test);
        expect(obj.value.byteLength).toBe(5);
      });
    });

    describe("EXPLICIT", () => {
      class Test {
        @src.AsnProp({
          type: src.AsnPropTypes.OctetString,
          context: 0,
        })
        public value!: ArrayBuffer;
      }

      it("serialize", () => {
        const obj = new Test();
        obj.value = new Uint8Array([1, 2, 3, 4, 5]).buffer;
        const buf = src.AsnSerializer.serialize(obj);
        assertBuffer(Buffer.from(buf), Buffer.from("3009a00704050102030405", "hex"));
      });

      it("parse", () => {
        const obj = src.AsnParser.parse(new Uint8Array(Buffer.from("3009a00704050102030405", "hex")).buffer, Test);
        expect(obj.value.byteLength).toBe(5);
      });
    });
  });

  describe("BitString", () => {
    describe("EXPLICIT", () => {
      it("unused bits 0", () => {
        class Test {
          @src.AsnProp({ type: src.AsnPropTypes.BitString })
          public value = new Uint8Array([255, 1]).buffer;
        }
        const der = src.AsnSerializer.serialize(new Test());
        expect(Buffer.from(der).toString("hex")).toBe("3005030300ff01");

        const obj = src.AsnParser.parse(der, Test);
        expect(obj.value.byteLength).toBe(2);
      });
    });
    describe("IMPLICIT", () => {
      it("unused bits 0", () => {
        class Test {
          @src.AsnProp({
            type: src.AsnPropTypes.BitString,
            context: 0,
            implicit: true,
          })
          public value = new Uint8Array([255, 1]).buffer;
        }
        const der = src.AsnSerializer.serialize(new Test());
        expect(Buffer.from(der).toString("hex")).toBe("3005800300ff01");

        const obj = src.AsnParser.parse(der, Test);
        expect(obj.value.byteLength).toBe(2);
      });
    });
  });

  describe("IA5String", () => {
    it("IMPLICIT", () => {
      class Test {
        @src.AsnProp({
          type: src.AsnPropTypes.IA5String,
          context: 2,
          implicit: true,
        })
        public value = "test";
      }

      const der = src.AsnSerializer.serialize(new Test());
      expect(Buffer.from(der).toString("hex")).toBe("3006820474657374");

      const obj = src.AsnParser.parse(der, Test);
      expect(obj.value).toBe("test");
    });
  });

  describe("Convertible", () => {
    it("correct", () => {
      class Test implements src.IAsnConvertible {
        public value = "";
        public fromASN(asn: asn1js.Utf8String): this {
          this.value = asn.valueBlock.value;
          return this;
        }

        public toASN(): asn1js.Utf8String {
          return new asn1js.Utf8String({ value: this.value });
        }

        public toSchema(name: string): asn1js.Utf8String {
          return new asn1js.Utf8String({ name });
        }
      }

      const obj1 = new Test();
      obj1.value = "test";

      const der = src.AsnSerializer.serialize(obj1);
      expect(Buffer.from(der).toString("hex")).toBe("0c0474657374");

      const obj2 = src.AsnParser.parse(der, Test);
      expect(obj1.value).toBe(obj2.value);
    });
  });

  it("optional property", () => {
    class Test {
      @src.AsnProp({
        type: src.AsnPropTypes.Utf8String,
        optional: true,
      })
      public opt?: string;

      @src.AsnProp({ type: src.AsnPropTypes.Integer })
      public value = 1;
    }

    const obj1 = new Test();
    const der = src.AsnSerializer.serialize(obj1);
    expect(Buffer.from(der).toString("hex")).toBe("3003020101");

    const obj2 = src.AsnParser.parse(der, Test);
    expect(obj2.opt).toBe(undefined);
    expect(obj2.value).toBe(1);
  });

  describe("REPEATED", () => {
    describe("PRIMITIVE", () => {
      it("SET", () => {
        class Test {
          @src.AsnProp({
            type: src.AsnPropTypes.Integer,
            repeated: "set",
          })
          public values = [1, 2, 3, 4, 5];
        }

        const obj1 = new Test();
        const der = src.AsnSerializer.serialize(obj1);
        expect(Buffer.from(der).toString("hex")).toBe("3011310f020101020102020103020104020105");

        const obj2 = src.AsnParser.parse(der, Test);
        expect(obj2.values.join("")).toBe("12345");
      });
      it("SEQUENCE", () => {
        class Test {
          @src.AsnProp({
            type: src.AsnPropTypes.Integer,
            repeated: "sequence",
          })
          public values = [1, 2, 3, 4, 5];
        }

        const obj1 = new Test();
        const der = src.AsnSerializer.serialize(obj1);
        expect(Buffer.from(der).toString("hex")).toBe("3011300f020101020102020103020104020105");

        const obj2 = src.AsnParser.parse(der, Test);
        expect(obj2.values.join("")).toBe("12345");
      });
    });
    describe("CONSTRUCTED", () => {
      it("SET", () => {
        class Child {
          @src.AsnProp({ type: src.AsnPropTypes.Integer })
          public value = 0;

          constructor(value?: number) {
            if (value !== undefined) {
              this.value = value;
            }
          }
        }
        class Test {
          @src.AsnProp({
            type: Child,
            repeated: "set",
          })
          public values: Child[] = [];
        }

        const obj1 = new Test();
        obj1.values.push(new Child(1));
        obj1.values.push(new Child(2));
        const der = src.AsnSerializer.serialize(obj1);
        expect(Buffer.from(der).toString("hex")).toBe("300c310a30030201013003020102");

        const obj2 = src.AsnParser.parse(der, Test);
        expect(obj2.values.length).toBe(2);
        expect(obj2.values[0].value).toBe(1);
        expect(obj2.values[1].value).toBe(2);
      });
      it("SEQUENCE", () => {
        class Child {
          @src.AsnProp({ type: src.AsnPropTypes.Integer })
          public value = 0;

          constructor(value?: number) {
            if (value !== undefined) {
              this.value = value;
            }
          }
        }
        class Test {
          @src.AsnProp({
            type: Child,
            repeated: "sequence",
          })
          public values: Child[] = [];
        }

        const obj1 = new Test();
        obj1.values.push(new Child(1));
        obj1.values.push(new Child(2));
        const der = src.AsnSerializer.serialize(obj1);
        expect(Buffer.from(der).toString("hex")).toBe("300c300a30030201013003020102");

        const obj2 = src.AsnParser.parse(der, Test);
        expect(obj2.values.length).toBe(2);
        expect(obj2.values[0].value).toBe(1);
        expect(obj2.values[1].value).toBe(2);
      });
    });
  });

  it("throw error on unsupported type of Asn1Type", () => {
    @src.AsnType({ type: 5 as unknown as src.AsnTypeTypes })
    class Test {
      @src.AsnProp({ type: src.AsnPropTypes.Integer })
      public value = 1;
    }

    const obj1 = new Test();
    expect(() => {
      src.AsnSerializer.serialize(obj1);
    }).toThrow();
  });

  describe("Parse", () => {
    describe("incoming buffers", () => {
      class Test {
        @src.AsnProp({ type: src.AsnPropTypes.Integer })
        public value = 1;
      }
      const arrayBuffer = new Uint8Array([48, 3, 2, 1, 1]).buffer;

      it("Buffer", () => {
        const obj = src.AsnParser.parse(Buffer.from(arrayBuffer), Test);
        expect(obj.value).toBe(1);
      });
      it("ArrayBuffer", () => {
        const obj = src.AsnParser.parse(arrayBuffer, Test);
        expect(obj.value).toBe(1);
      });
      it("ArrayBufferView", () => {
        const obj = src.AsnParser.parse(new Uint8Array(arrayBuffer), Test);
        expect(obj.value).toBe(1);
      });
      it("ArrayBufferView", () => {
        expect(() => {
          src.AsnParser.parse([48, 3, 2, 1, 1] as unknown as BufferSourceLike, Test);
        }).toThrow();
      });
    });

    it("throw error on wrong ASN1 encoded data", () => {
      class Test {
        @src.AsnProp({ type: src.AsnPropTypes.Integer })
        public value = 1;
      }
      expect(() => {
        src.AsnParser.parse(Buffer.from("010506", "hex"), Test);
      }).toThrow();
    });
    it("throw error on if schema doesn't match to ASN1 structure", () => {
      class Test {
        @src.AsnProp({ type: src.AsnPropTypes.Integer })
        public value = 1;
      }
      expect(() => {
        src.AsnParser.parse(Buffer.from("010101", "hex"), Test);
      }).toThrow();
    });
  });

  describe("Repeated SET using AsnType decorator", () => {
    @src.AsnType({
      type: src.AsnTypeTypes.Set,
      itemType: src.AsnPropTypes.ObjectIdentifier,
    })
    class Test extends src.AsnArray<string> {}

    const testHex = "310c06042a030405060453040506";

    it("serialize", () => {
      const obj = new Test(["1.2.3.4.5", "2.3.4.5.6"]);
      const buf = src.AsnSerializer.serialize(obj);
      assertBuffer(Buffer.from(buf), Buffer.from(testHex, "hex"));
    });
    it("parse", () => {
      const obj = src.AsnParser.parse(new Uint8Array(Buffer.from(testHex, "hex")).buffer, Test);
      expect(obj.join(", ")).toBe("1.2.3.4.5, 2.3.4.5.6");
      expect(obj instanceof Test).toBe(true);
    });
  });

  // https://github.com/PeculiarVentures/asn1-schema/issues/75
  describe("issue #75", () => {
    it("parse 3 bytes INTEGER", () => {
      @src.AsnType({ type: src.AsnTypeTypes.Choice })
      class Test {
        @src.AsnProp({ type: src.AsnPropTypes.Integer })
        public value!: number;
      }

      const buf = Buffer.from("0203010203", "hex");
      const test = src.AsnConvert.parse(buf, Test);

      expect(test.value).toBe(66051);
    });

    it("parse 4 bytes INTEGER", () => {
      @src.AsnType({ type: src.AsnTypeTypes.Choice })
      class Test {
        @src.AsnProp({ type: src.AsnPropTypes.Integer })
        public value!: number;
      }

      const buf = Buffer.from("020401020304", "hex");
      const test = src.AsnConvert.parse(buf, Test);

      expect(test.value).toBe("16909060");
    });

    it("parse more than 4 bytes INTEGER", () => {
      @src.AsnType({ type: src.AsnTypeTypes.Choice })
      class Test {
        @src.AsnProp({ type: src.AsnPropTypes.Integer })
        public value!: number;
      }

      const buf = Buffer.from("020f0102030405060708090a0b0c0d0e0f01", "hex");
      const test = src.AsnConvert.parse(buf, Test);

      expect(test.value).toBe("5233100606242806050955395731361295");
    });
  });

  // https://github.com/PeculiarVentures/asn1-schema/issues/134
  describe("issue #134 - fromBER parse options", () => {
    @src.AsnType({
      type: src.AsnTypeTypes.Sequence,
      itemType: src.AsnPropTypes.Integer,
    })
    class BigList extends src.AsnArray<number> {}

    // 1 SEQUENCE + N INTEGER nodes; > default maxNodes (10000) when N >= 10000
    const bigCount = 10010;
    const bigListDer = new asn1js.Sequence({ value: Array.from({ length: bigCount }, (_, i) => new asn1js.Integer({ value: i })) }).toBER(false);

    it("throws on a large structure with default limits", () => {
      expect(() => src.AsnConvert.parse(bigListDer, BigList)).toThrow(/Maximum ASN.1 node count exceeded/);
    });

    it("parses a large structure when berOptions.maxNodes is raised", () => {
      const parsed = src.AsnConvert.parse(bigListDer, BigList, { berOptions: { maxNodes: bigCount + 100 } });
      expect(parsed.length).toBe(bigCount);
    });

    it("forwards berOptions.maxDepth through AsnConvert.toString", () => {
      let deep: asn1js.AsnType = new asn1js.Integer({ value: 1 });
      for (let i = 0; i < 150; i++) {
        deep = new asn1js.Sequence({ value: [deep] });
      }
      const deepDer = deep.toBER(false);

      expect(() => src.AsnConvert.toString(deepDer)).toThrow(/Maximum ASN.1 nesting depth exceeded/);
      expect(typeof src.AsnConvert.toString(deepDer, { berOptions: { maxDepth: 200 } })).toBe("string");
    });

    it("forwards berOptions to the internal IMPLICIT repeated re-parse", () => {
      // `[1] IMPLICIT SEQUENCE OF INTEGER` is normalized via an internal fromBER
      // call (processRepeatedPrimitiveItem). Raising maxNodes must reach it too.
      class Implicit {
        @src.AsnProp({
          type: src.AsnPropTypes.Integer,
          repeated: "sequence",
          implicit: true,
          context: 1,
        })
        public items: number[] = [];
      }
      const obj = new Implicit();
      obj.items = Array.from({ length: bigCount }, (_, i) => i);
      const der = src.AsnConvert.serialize(obj);

      expect(() => src.AsnConvert.parse(der, Implicit)).toThrow(/Maximum ASN.1 node count exceeded/);
      const parsed = src.AsnConvert.parse(der, Implicit, { berOptions: { maxNodes: bigCount + 100 } });
      expect(parsed.items.length).toBe(bigCount);
    });

    it("serializes an ANY value that exceeds the default parse limits", () => {
      // AsnAnyConverter.toASN re-parses the value to build the schema. That is the
      // serialize path, where the data comes from the caller and AsnConvert.serialize
      // has no options to raise the limits, so the limits must not apply there.
      class WithAny {
        @src.AsnProp({ type: src.AsnPropTypes.Any })
        public value!: ArrayBuffer;
      }

      let deep: asn1js.AsnType = new asn1js.Integer({ value: 1 });
      for (let i = 0; i < 150; i++) {
        deep = new asn1js.Sequence({ value: [deep] });
      }

      for (const value of [bigListDer, deep.toBER(false)]) {
        const obj = new WithAny();
        obj.value = value;
        const der = src.AsnConvert.serialize(obj);
        // Reading it back is the parse path, where the limits still apply.
        const parsed = src.AsnConvert.parse(der, WithAny, { berOptions: { maxNodes: Infinity, maxDepth: Infinity } });
        assertBuffer(Buffer.from(parsed.value), Buffer.from(value));
      }
    });
  });
});

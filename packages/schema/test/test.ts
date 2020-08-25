// @ts-ignore
import * as asn1 from "asn1js";
import * as assert from "assert";
import { AsnProp, AsnPropTypes, AsnType, AsnTypeTypes, OctetString, AsnArray } from "../src";
import * as Converters from "../src/converters";
import { AsnParser } from "../src/parser";
import { AsnSerializer } from "../src/serializer";
import { IAsnConvertible } from "../src/types";

function assertBuffer(actual: Buffer, expected: Buffer) {
  assert.strictEqual(Buffer.compare(actual, expected), 0,
    `Buffers are not equal.\n\tActual:   ${actual.toString("hex")}\n\tExpected: ${expected.toString("hex")}`);
}

context("Test", () => {

  context("Default value", () => {
    class Test {
      @AsnProp({ type: AsnPropTypes.Integer, defaultValue: 0 })
      public version = 0;
    }
    context("serialize", () => {
      it("not equal to default", () => {
        const obj = new Test();
        obj.version = 1;

        const res = Buffer.from(AsnSerializer.serialize(obj));
        assertBuffer(res, Buffer.from([48, 3, 2, 1, 1]));
      });
      it("equal to default", () => {
        const obj = new Test();
        obj.version = 0;

        const res = Buffer.from(AsnSerializer.serialize(obj));
        assertBuffer(res, Buffer.from("3000", "hex"));
      });
    });
  });

  context("CHOICE", () => {

    context("CONTEXT-SPECIFIC", () => {

      class Child {
        @AsnProp({ type: AsnPropTypes.Integer })
        public value = 2;
        @AsnProp({ type: AsnPropTypes.Utf8String })
        public text = "test";
      }

      @AsnType({ type: AsnTypeTypes.Choice })
      class Test {
        @AsnProp({ type: AsnPropTypes.OctetString, context: 0, implicit: true })
        public select1?: ArrayBuffer;
        @AsnProp({ type: AsnPropTypes.Utf8String, context: 1 })
        public select2?: string;
        @AsnProp({ type: AsnPropTypes.Integer, context: 2 })
        public select3?: number;
        @AsnProp({ type: Child, context: 3, implicit: true })
        public select4?: Child;
      }
      context("EXPLICIT", () => {
        it("serialize", () => {
          const obj = new Test();
          obj.select2 = "test";
          const buf = AsnSerializer.serialize(obj);
          assertBuffer(Buffer.from(buf), Buffer.from("a1060c0474657374", "hex"));
        });
        it("parse", () => {
          const obj = AsnParser.parse(Buffer.from("a1060c0474657374", "hex"), Test);
          assert.strictEqual(obj.select2, "test");
        });
      });
      context("IMPLICIT", () => {
        context("Primitive", () => {
          it("serialize", () => {
            const obj = new Test();
            obj.select1 = new Uint8Array([1, 2, 3, 4, 5]).buffer;
            const buf = AsnSerializer.serialize(obj);
            assertBuffer(Buffer.from(buf), Buffer.from("80050102030405", "hex"));
          });
          it("parse", () => {
            const obj = AsnParser.parse(new Uint8Array(Buffer.from("80050102030405", "hex")).buffer, Test);
            assert.strictEqual(obj.select1!.byteLength, 5);
          });
        });
        context("Repeated SET", () => {

          class Test2 {
            @AsnProp({ type: AsnPropTypes.Integer, repeated: "set", implicit: true, context: 1 })
            public items: number[] = [];
          }
          const testHex = "3011a10f020101020102020103020104020105";

          it("serialize", () => {
            const obj = new Test2();
            obj.items = [1, 2, 3, 4, 5];
            const buf = AsnSerializer.serialize(obj);
            assertBuffer(Buffer.from(buf), Buffer.from(testHex, "hex"));
          });
          it("parse", () => {
            const obj = AsnParser.parse(new Uint8Array(Buffer.from(testHex, "hex")).buffer, Test2);
            assert.strictEqual(obj.items.join(""), "12345");
          });
        });
        context("Repeated SEQUENCE", () => {

          class Test2 {
            @AsnProp({ type: AsnPropTypes.Integer, repeated: "sequence", implicit: true, context: 1 })
            public items: number[] = [];
          }
          const testHex = "3011a10f020101020102020103020104020105";

          it("serialize", () => {
            const obj = new Test2();
            obj.items = [1, 2, 3, 4, 5];
            const buf = AsnSerializer.serialize(obj);
            assertBuffer(Buffer.from(buf), Buffer.from(testHex, "hex"));
          });
          it("parse", () => {
            const obj = AsnParser.parse(new Uint8Array(Buffer.from(testHex, "hex")).buffer, Test2);
            assert.strictEqual(obj.items.join(""), "12345");
          });
        });
        context("Constructed", () => {
          const der = Buffer.from("a3090201020c0474657374", "hex");
          it("stringify", () => {
            const obj = new Test();
            obj.select4 = new Child();

            const buf = AsnSerializer.serialize(obj);
            assert.strictEqual(Buffer.from(buf).toString("hex"), der.toString("hex"));
          });
          it("parse", () => {
            const obj = AsnParser.parse(new Uint8Array(der).buffer, Test);
            assert.strictEqual(!!obj.select4, true);
            assert.strictEqual(obj.select4!.text, "test");
            assert.strictEqual(obj.select4!.value, 2);
          });
        });
      });
    });

    context("PRIMITIVES", () => {
      @AsnType({ type: AsnTypeTypes.Choice })
      class Choice {
        @AsnProp({ type: AsnPropTypes.Integer })
        public numValue!: number;
        @AsnProp({ type: AsnPropTypes.Boolean })
        public boolValue!: boolean;
        @AsnProp({ type: AsnPropTypes.ObjectIdentifier })
        public oidValue!: string;
      }
      it("serialize", () => {
        const obj = new Choice();
        obj.oidValue = "1.2.3";

        const res = Buffer.from(AsnSerializer.serialize(obj));
        assertBuffer(res, Buffer.from("06022a03", "hex"));
      });
      it("parse", () => {
        const obj = AsnParser.parse(new Uint8Array(Buffer.from("06022a03", "hex")).buffer, Choice);
        assert.strictEqual(obj.oidValue, "1.2.3");
      });
    });

    it("throw error if choice doesn't have as min one value", () => {
      @AsnType({ type: AsnTypeTypes.Choice })
      class Test {
        @AsnProp({ type: AsnPropTypes.Integer })
        public case1?: number;
        @AsnProp({ type: AsnPropTypes.Utf8String })
        public case2?: string;
      }

      const obj1 = new Test();
      assert.throws(() => {
        AsnSerializer.serialize(obj1);
      });
    });
  });

  context("Converter", () => {
    function test(cls: any, hex: string, expected: any, assertCb?: (value: any, excepted: any) => void) {
      it("serialize", () => {
        const obj = new cls();
        obj.value = expected;
        const res = Buffer.from(AsnSerializer.serialize(obj));
        assertBuffer(res, Buffer.from(hex, "hex"));
      });
      it("parse", () => {
        const obj = AsnParser.parse(
          new Uint8Array(Buffer.from(hex, "hex")).buffer,
          cls,
        ) as any;
        // console.log(obj);
        if (assertCb) {
          assertCb(obj.value, expected);
        } else {
          assert.strictEqual(obj.value, expected);
        }
      });
    }
    context("Default", () => {
      context("IntegerConverter", () => {
        class Test {
          @AsnProp({ type: AsnPropTypes.Integer })
          public value!: string | number;
        }
        context("Short number", () => {
          /**
           * SEQUENCE (1 elem)
           *   INTEGER 10
           */
          test(Test, "300302010a", 10);
        });
        context("Big number", () => {
          /**
           * SEQUENCE (1 elem)
           *   INTEGER (47 bit) 123456789012345
           */
          test(Test, "300802067048860ddf79", "123456789012345");
        });
      });
      context("BooleanConverter", () => {
        class Test {
          @AsnProp({ type: AsnPropTypes.Boolean })
          public value!: boolean;
        }
        /**
         * SEQUENCE (1 elem)
         *   BOOLEAN true
         */
        test(Test, "30030101ff", true);
      });
      context("ObjectIdentifierConverter", () => {
        class Test {
          @AsnProp({ type: AsnPropTypes.ObjectIdentifier })
          public value!: string;
        }
        /**
         * SEQUENCE (1 elem)
         *   OBJECT IDENTIFIER 1.2.3.4.5
         */
        test(Test, "300606042a030405", "1.2.3.4.5");
      });
      context("OctetStringConverter", () => {
        class Test {
          @AsnProp({ type: AsnPropTypes.OctetString })
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
      context("AnyConverter", () => {
        class Test {
          @AsnProp({ type: AsnPropTypes.Any })
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
      context("EnumeratedConverter", () => {
        class Test {
          @AsnProp({ type: AsnPropTypes.Enumerated })
          public value!: boolean;
        }
        /**
         * SEQUENCE (1 elem)
         *   ENUMERATED
         */
        test(Test, "30030a0101", 1);
      });
      context("Utf8StringConverter", () => {
        class Test {
          @AsnProp({ type: AsnPropTypes.Utf8String })
          public value!: string;
        }
        /**
         * SEQUENCE (1 elem)
         *   UTF8String My test text
         */
        test(Test, "300e0c0c4d7920746573742074657874", "My test text");
      });
      context("BmpStringConverter", () => {
        class Test {
          @AsnProp({ type: AsnPropTypes.BmpString })
          public value!: string;
        }
        /**
         * SEQUENCE (1 elem)
         *   BMPString My test text
         */
        test(Test, "301a1e18004d00790020007400650073007400200074006500780074", "My test text");
      });
      context("UniversalStringConverter", () => {
        class Test {
          @AsnProp({ type: AsnPropTypes.UniversalString })
          public value!: string;
        }
        /**
         * SEQUENCE (1 elem)
         *   Universal My test text
         */
        // tslint:disable-next-line:max-line-length
        test(Test, "30321c300000004d0000007900000020000000740000006500000073000000740000002000000074000000650000007800000074", "My test text");
      });
      context("NumericStringConverter", () => {
        class Test {
          @AsnProp({ type: AsnPropTypes.NumericString })
          public value!: string;
        }
        /**
         * SEQUENCE (1 elem)
         *   NumericString 12345
         */
        test(Test, "300712053132333435", "12345");
      });
      context("PrintableStringConverter", () => {
        class Test {
          @AsnProp({ type: AsnPropTypes.PrintableString })
          public value!: string;
        }
        /**
         * SEQUENCE (1 elem)
         *   PrintableString My test text
         */
        test(Test, "300e130c4d7920746573742074657874", "My test text");
      });
      context("TeletexStringConverter", () => {
        class Test {
          @AsnProp({ type: AsnPropTypes.TeletexString })
          public value!: string;
        }
        /**
         * SEQUENCE (1 elem)
         *   TeletexString My test text
         */
        test(Test, "300e140c4d7920746573742074657874", "My test text");
      });
      context("VideotexStringConverter", () => {
        class Test {
          @AsnProp({ type: AsnPropTypes.VideotexString })
          public value!: string;
        }
        /**
         * SEQUENCE (1 elem)
         *   VideotexString My test text
         */
        test(Test, "300e150c4d7920746573742074657874", "My test text");
      });
      context("IA5StringConverter", () => {
        class Test {
          @AsnProp({ type: AsnPropTypes.IA5String })
          public value!: string;
        }
        /**
         * SEQUENCE (1 elem)
         *   IA5String My test text
         */
        test(Test, "300e160c4d7920746573742074657874", "My test text");
      });
      context("GraphicStringConverter", () => {
        class Test {
          @AsnProp({ type: AsnPropTypes.GraphicString })
          public value!: string;
        }
        /**
         * SEQUENCE (1 elem)
         *   GraphicString My test text
         */
        test(Test, "300e190c4d7920746573742074657874", "My test text");
      });
      context("VisibleStringConverter", () => {
        class Test {
          @AsnProp({ type: AsnPropTypes.VisibleString })
          public value!: string;
        }
        /**
         * SEQUENCE (1 elem)
         *   VisibleString My test text
         */
        test(Test, "300e1a0c4d7920746573742074657874", "My test text");
      });
      context("GeneralStringConverter", () => {
        class Test {
          @AsnProp({ type: AsnPropTypes.GeneralString })
          public value!: string;
        }
        /**
         * SEQUENCE (1 elem)
         *   GeneralString My test text
         */
        test(Test, "300e1b0c4d7920746573742074657874", "My test text");
      });
      context("CharacterStringConverter", () => {
        class Test {
          @AsnProp({ type: AsnPropTypes.CharacterString })
          public value!: string;
        }
        /**
         * SEQUENCE (1 elem)
         *   CharacterString My test text
         */
        test(Test, "300e1d0c4d7920746573742074657874", "My test text");
      });
    });
    context("Custom", () => {
      context("IntegerArrayBufferConverter", () => {
        class Test {
          @AsnProp({ type: AsnPropTypes.Integer, converter: Converters.AsnIntegerArrayBufferConverter })
          public value!: ArrayBuffer;
        }
        /**
         * SEQUENCE (1 elem)
         *   INTEGER (89 bit) 311917102708983781990072578
         */
        test(
          Test,
          "300e020c010203040506070809000102",
          new Uint8Array([1, 2, 3, 4, 5, 6, 7, 8, 9, 0, 1, 2]).buffer,
          (value, expected) => {
            assertBuffer(Buffer.from(value), Buffer.from("010203040506070809000102", "hex"));
          },
        );
      });
    });
  });

  context("Constructed type", () => {
    it("SEQUENCE ", () => {
      class Test {
        @AsnProp({ type: AsnPropTypes.Integer })
        public value = 1;
      }

      const obj1 = new Test();
      const der = AsnSerializer.serialize(obj1);
      assert.strictEqual(Buffer.from(der).toString("hex"), "3003020101");

      const obj2 = AsnParser.parse(der, Test);
      assert.strictEqual(obj2.value, 1);
    });
    it("SET", () => {
      @AsnType({ type: AsnTypeTypes.Set })
      class Test {
        @AsnProp({ type: AsnPropTypes.Integer })
        public value = 1;
      }

      const obj1 = new Test();
      const der = AsnSerializer.serialize(obj1);
      assert.strictEqual(Buffer.from(der).toString("hex"), "3103020101");

      const obj2 = AsnParser.parse(der, Test);
      assert.strictEqual(obj2.value, 1);
    });
    it("child schema ", () => {
      class TbsCertificate {
        public static VERSION = 0;

        @AsnProp({
          type: AsnPropTypes.Integer,
          defaultValue: TbsCertificate.VERSION,
          context: 0,
        })
        public version = 2;
      }

      class Certificate {
        @AsnProp({ type: TbsCertificate })
        public tbs = new TbsCertificate();
      }

      const cert = new Certificate();
      const buf = AsnSerializer.serialize(cert);
      /**
       * SEQUENCE (1 elem)
       *   SEQUENCE (1 elem)
       *     [0] (1 elem)
       *       INTEGER 2
       */
      assertBuffer(Buffer.from(buf), Buffer.from("30073005a003020102", "hex"));
    });
  });

  context("CONTEXT-SPECIFIC", () => {

    context("IMPLICIT", () => {

      class Test {
        @AsnProp({
          type: OctetString,
          context: 0,
          implicit: true,
        })
        public value = new OctetString();
      }

      it("serialize", () => {
        const obj = new Test();
        obj.value = new OctetString([1, 2, 3, 4, 5]);
        const buf = AsnSerializer.serialize(obj);
        assertBuffer(Buffer.from(buf), Buffer.from("300780050102030405", "hex"));
      });

      it("parse", () => {
        const obj = AsnParser.parse(new Uint8Array(Buffer.from("300780050102030405", "hex")).buffer, Test);
        assert.strictEqual(obj.value.byteLength, 5);
      });

    });

    context("EXPLICIT", () => {

      class Test {
        @AsnProp({
          type: AsnPropTypes.OctetString,
          context: 0,
        })
        public value!: ArrayBuffer;
      }

      it("serialize", () => {
        const obj = new Test();
        obj.value = new Uint8Array([1, 2, 3, 4, 5]).buffer;
        const buf = AsnSerializer.serialize(obj);
        assertBuffer(Buffer.from(buf), Buffer.from("3009a00704050102030405", "hex"));
      });

      it("parse", () => {
        const obj = AsnParser.parse(new Uint8Array(Buffer.from("3009a00704050102030405", "hex")).buffer, Test);
        assert.strictEqual(obj.value.byteLength, 5);
      });

    });

  });

  context("BitString", () => {
    context("EXPLICIT", () => {
      it("unused bits 0", () => {
        class Test {
          @AsnProp({ type: AsnPropTypes.BitString })
          public value = new Uint8Array([255, 1]).buffer;
        }
        const der = AsnSerializer.serialize(new Test());
        assert.strictEqual(Buffer.from(der).toString("hex"), "3005030300ff01");

        const obj = AsnParser.parse(der, Test);
        assert.strictEqual(obj.value.byteLength, 2);
      });
    });
    context("IMPLICIT", () => {
      it("unused bits 0", () => {
        class Test {
          @AsnProp({ type: AsnPropTypes.BitString, context: 0, implicit: true })
          public value = new Uint8Array([255, 1]).buffer;
        }
        const der = AsnSerializer.serialize(new Test());
        assert.strictEqual(Buffer.from(der).toString("hex"), "3005800300ff01");

        const obj = AsnParser.parse(der, Test);
        assert.strictEqual(obj.value.byteLength, 2);
      });
    });
  });

  context("IA5String", () => {
    it("IMPLICIT", () => {
      class Test {

        @AsnProp({ type: AsnPropTypes.IA5String, context: 2, implicit: true })
        public value = "test";
      }

      const der = AsnSerializer.serialize(new Test());
      assert.strictEqual(Buffer.from(der).toString("hex"), "3006820474657374");

      const obj = AsnParser.parse(der, Test);
      assert.strictEqual(obj.value, "test");
    });
  });

  context("Convertible", () => {
    it("correct", () => {
      class Test implements IAsnConvertible {
        public value = "";
        public fromASN(asn: any): this {
          this.value = asn.valueBlock.value;
          return this;
        }
        public toASN(): any {
          return new asn1.Utf8String({ value: this.value });
        }

        public toSchema(name: string) {
          return new asn1.Utf8String({ name } as any);
        }
      }

      const obj1 = new Test();
      obj1.value = "test";

      const der = AsnSerializer.serialize(obj1);
      assert.strictEqual(Buffer.from(der).toString("hex"), "0c0474657374");

      const obj2 = AsnParser.parse(der, Test);
      assert.strictEqual(obj1.value, obj2.value);
    });
  });

  it("optional property", () => {
    class Test {
      @AsnProp({ type: AsnPropTypes.Utf8String, optional: true })
      public opt?: string;
      @AsnProp({ type: AsnPropTypes.Integer })
      public value = 1;
    }

    const obj1 = new Test();
    const der = AsnSerializer.serialize(obj1);
    assert.strictEqual(Buffer.from(der).toString("hex"), "3003020101");

    const obj2 = AsnParser.parse(der, Test);
    assert.strictEqual(obj2.opt, undefined);
    assert.strictEqual(obj2.value, 1);
  });

  context("REPEATED", () => {
    context("PRIMITIVE", () => {
      it("SET", () => {
        class Test {
          @AsnProp({ type: AsnPropTypes.Integer, repeated: "set" })
          public values = [1, 2, 3, 4, 5];
        }

        const obj1 = new Test();
        const der = AsnSerializer.serialize(obj1);
        assert.strictEqual(Buffer.from(der).toString("hex"), "3011310f020101020102020103020104020105");

        const obj2 = AsnParser.parse(der, Test);
        assert.strictEqual(obj2.values.join(""), "12345");
      });
      it("SEQUENCE", () => {
        class Test {
          @AsnProp({ type: AsnPropTypes.Integer, repeated: "sequence" })
          public values = [1, 2, 3, 4, 5];
        }

        const obj1 = new Test();
        const der = AsnSerializer.serialize(obj1);
        assert.strictEqual(Buffer.from(der).toString("hex"), "3011300f020101020102020103020104020105");

        const obj2 = AsnParser.parse(der, Test);
        assert.strictEqual(obj2.values.join(""), "12345");
      });
    });
    context("CONSTRUCTED", () => {
      it("SET", () => {
        class Child {
          @AsnProp({ type: AsnPropTypes.Integer })
          public value = 0;
          constructor(value?: number) {
            if (value !== undefined) {
              this.value = value;
            }
          }
        }
        class Test {
          @AsnProp({ type: Child, repeated: "set" })
          public values: Child[] = [];
        }

        const obj1 = new Test();
        obj1.values.push(new Child(1));
        obj1.values.push(new Child(2));
        const der = AsnSerializer.serialize(obj1);
        assert.strictEqual(Buffer.from(der).toString("hex"), "300c310a30030201013003020102");

        const obj2 = AsnParser.parse(der, Test);
        assert.strictEqual(obj2.values.length, 2);
        assert.strictEqual(obj2.values[0].value, 1);
        assert.strictEqual(obj2.values[1].value, 2);
      });
      it("SEQUENCE", () => {
        class Child {
          @AsnProp({ type: AsnPropTypes.Integer })
          public value = 0;
          constructor(value?: number) {
            if (value !== undefined) {
              this.value = value;
            }
          }
        }
        class Test {
          @AsnProp({ type: Child, repeated: "sequence" })
          public values: Child[] = [];
        }

        const obj1 = new Test();
        obj1.values.push(new Child(1));
        obj1.values.push(new Child(2));
        const der = AsnSerializer.serialize(obj1);
        assert.strictEqual(Buffer.from(der).toString("hex"), "300c300a30030201013003020102");

        const obj2 = AsnParser.parse(der, Test);
        assert.strictEqual(obj2.values.length, 2);
        assert.strictEqual(obj2.values[0].value, 1);
        assert.strictEqual(obj2.values[1].value, 2);
      });
    });
  });

  it("throw error on unsupported type of Asn1Type", () => {
    @AsnType({ type: 5 })
    class Test {
      @AsnProp({ type: AsnPropTypes.Integer })
      public value = 1;
    }

    const obj1 = new Test();
    assert.throws(() => {
      AsnSerializer.serialize(obj1);
    });
  });

  context("Parse", () => {

    context("incoming buffers", () => {
      class Test {
        @AsnProp({ type: AsnPropTypes.Integer })
        public value = 1;
      }
      const arrayBuffer = new Uint8Array([48, 3, 2, 1, 1]).buffer;

      it("Buffer", () => {
        const obj = AsnParser.parse(Buffer.from(arrayBuffer), Test);
        assert.strictEqual(obj.value, 1);
      });
      it("ArrayBuffer", () => {
        const obj = AsnParser.parse(arrayBuffer, Test);
        assert.strictEqual(obj.value, 1);
      });
      it("ArrayBufferView", () => {
        const obj = AsnParser.parse(new Uint8Array(arrayBuffer), Test);
        assert.strictEqual(obj.value, 1);
      });
      it("ArrayBufferView", () => {
        assert.throws(() => {
          AsnParser.parse([48, 3, 2, 1, 1] as any, Test);
        });
      });
    });

    it("throw error on wrong ASN1 encoded data", () => {
      class Test {
        @AsnProp({ type: AsnPropTypes.Integer })
        public value = 1;
      }
      assert.throws(() => {
        AsnParser.parse(Buffer.from("010506", "hex"), Test);
      });
    });
    it("throw error on if schema doesn't match to ASN1 structure", () => {
      class Test {
        @AsnProp({ type: AsnPropTypes.Integer })
        public value = 1;
      }
      assert.throws(() => {
        AsnParser.parse(Buffer.from("010101", "hex"), Test);
      });
    });
  });

  context("Repeated SET using AsnType decorator", () => {

    @AsnType({ type: AsnTypeTypes.Set, itemType: AsnPropTypes.ObjectIdentifier })
    class Test extends AsnArray<string> { }

    const testHex = "310c06042a030405060453040506";

    it("serialize", () => {
      const obj = new Test(["1.2.3.4.5", "2.3.4.5.6"]);
      const buf = AsnSerializer.serialize(obj);
      assertBuffer(Buffer.from(buf), Buffer.from(testHex, "hex"));
    });
    it("parse", () => {
      const obj = AsnParser.parse(new Uint8Array(Buffer.from(testHex, "hex")).buffer, Test);
      assert.strictEqual(obj.join(", "), "1.2.3.4.5, 2.3.4.5.6");
      assert.strictEqual(obj instanceof Test, true);
      const type = typeof (obj);
    });
  });

});

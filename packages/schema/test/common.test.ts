import { describe, it, assert } from "vitest";
import * as src from "../src";

function assertBuffer(actual: Buffer, expected: Buffer): void {
  assert.strictEqual(
    Buffer.compare(actual, expected),
    0,
    `Buffers are not equal.\n\tActual:   ${actual.toString("hex")}\n\tExpected: ${expected.toString("hex")}`,
  );
}

describe("Test", () => {
  describe("Default value", () => {
    class Test {
      @src.AsnProp({ type: src.AsnPropTypes.Integer, defaultValue: 0 })
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
        @src.AsnProp({ type: src.AsnPropTypes.OctetString, context: 0, implicit: true })
        public select1?: ArrayBuffer;
        @src.AsnProp({ type: src.AsnPropTypes.Utf8String, context: 1 })
        public select2?: string;
        @src.AsnProp({ type: src.AsnPropTypes.Integer, context: 2 })
        public select3?: number;
        @src.AsnProp({ type: Child, context: 3, implicit: true })
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
          assert.strictEqual(obj.select2, "test");
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
            const obj = src.AsnParser.parse(
              new Uint8Array(Buffer.from("80050102030405", "hex")).buffer,
              Test,
            );
            assert.ok(obj.select1);
            assert.strictEqual(obj.select1.byteLength, 5);
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
            const obj = src.AsnParser.parse(
              new Uint8Array(Buffer.from(testHex, "hex")).buffer,
              Test2,
            );
            assert.strictEqual(obj.items.join(""), "12345");
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
            const obj = src.AsnParser.parse(
              new Uint8Array(Buffer.from(testHex, "hex")).buffer,
              Test2,
            );
            assert.strictEqual(obj.items.join(""), "12345");
          });
        });
        describe("Constructed", () => {
          const der = Buffer.from("a3090201020c0474657374", "hex");
          it("stringify", () => {
            const obj = new Test();
            obj.select4 = new Child();

            const buf = src.AsnSerializer.serialize(obj);
            assert.strictEqual(Buffer.from(buf).toString("hex"), der.toString("hex"));
          });
          it("parse", () => {
            const obj = src.AsnParser.parse(new Uint8Array(der).buffer, Test);
            assert.strictEqual(!!obj.select4, true);
            assert.ok(obj.select4);
            assert.strictEqual(obj.select4.text, "test");
            assert.strictEqual(obj.select4.value, 2);
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
        const obj = src.AsnParser.parse(
          new Uint8Array(Buffer.from("06022a03", "hex")).buffer,
          Choice,
        );
        assert.strictEqual(obj.oidValue, "1.2.3");
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
      assert.throws(() => {
        src.AsnSerializer.serialize(obj1);
      });
    });
  });

  describe("Converter", () => {
    function test<T>(
      cls: new () => { value: T },
      hex: string,
      expected: T,
      assertCb?: (value: T, excepted: T) => void,
    ): void {
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
          assert.strictEqual(obj.value, expected);
        }
      });
    }
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
      describe("OctetStringConverter", () => {
        class Test {
          @src.AsnProp({ type: src.AsnPropTypes.OctetString })
          public value!: ArrayBuffer;
        }
        /**
         * SEQUENCE (1 elem)
         *   OCTET STRING (5 byte) 0102030405
         */
        test(
          Test,
          "300704050102030405",
          new Uint8Array([1, 2, 3, 4, 5]).buffer,
          (value, expected) => {
            assertBuffer(Buffer.from(value), Buffer.from(expected));
          },
        );
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
        // tslint:disable-next-line:max-line-length
        test(
          Test,
          "30321c300000004d0000007900000020000000740000006500000073000000740000002000000074000000650000007800000074",
          "My test text",
        );
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
        test(
          Test,
          "300e020c010203040506070809000102",
          new Uint8Array([1, 2, 3, 4, 5, 6, 7, 8, 9, 0, 1, 2]).buffer,
          (value) => {
            assertBuffer(Buffer.from(value), Buffer.from("010203040506070809000102", "hex"));
          },
        );
      });
    });
    describe("BigInt", () => {
      @src.AsnChoiceType()
      class Test {
        @src.AsnProp({ type: src.AsnPropTypes.Integer, converter: src.AsnIntegerBigIntConverter })
        public value!: bigint;
      }

      it("positive number", () => {
        const value = BigInt("5172094299709469602635084381097487");

        const test = new Test();
        test.value = value;

        const asn = src.AsnConvert.serialize(test);
        assert.strictEqual(Buffer.from(asn).toString("hex"), "020f00ff010203040508090a0b0c0d0e0f");
      });

      it("negative number", () => {
        const value = BigInt("-123456");

        const test = new Test();
        test.value = value;

        const asn = src.AsnConvert.serialize(test);
        assert.strictEqual(Buffer.from(asn).toString("hex"), "0203fe1dc0");
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
      assert.strictEqual(Buffer.from(der).toString("hex"), "3003020101");

      const obj2 = src.AsnParser.parse(der, Test);
      assert.strictEqual(obj2.value, 1);
    });
    it("SET", () => {
      @src.AsnType({ type: src.AsnTypeTypes.Set })
      class Test {
        @src.AsnProp({ type: src.AsnPropTypes.Integer })
        public value = 1;
      }

      const obj1 = new Test();
      const der = src.AsnSerializer.serialize(obj1);
      assert.strictEqual(Buffer.from(der).toString("hex"), "3103020101");

      const obj2 = src.AsnParser.parse(der, Test);
      assert.strictEqual(obj2.value, 1);
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
        const obj = src.AsnParser.parse(
          new Uint8Array(Buffer.from("300780050102030405", "hex")).buffer,
          Test,
        );
        assert.strictEqual(obj.value.byteLength, 5);
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
        const obj = src.AsnParser.parse(
          new Uint8Array(Buffer.from("3009a00704050102030405", "hex")).buffer,
          Test,
        );
        assert.strictEqual(obj.value.byteLength, 5);
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
        assert.strictEqual(Buffer.from(der).toString("hex"), "3005030300ff01");

        const obj = src.AsnParser.parse(der, Test);
        assert.strictEqual(obj.value.byteLength, 2);
      });
    });
    describe("IMPLICIT", () => {
      it("unused bits 0", () => {
        class Test {
          @src.AsnProp({ type: src.AsnPropTypes.BitString, context: 0, implicit: true })
          public value = new Uint8Array([255, 1]).buffer;
        }
        const der = src.AsnSerializer.serialize(new Test());
        assert.strictEqual(Buffer.from(der).toString("hex"), "3005800300ff01");

        const obj = src.AsnParser.parse(der, Test);
        assert.strictEqual(obj.value.byteLength, 2);
      });
    });
  });

  describe("IA5String", () => {
    it("IMPLICIT", () => {
      class Test {
        @src.AsnProp({ type: src.AsnPropTypes.IA5String, context: 2, implicit: true })
        public value = "test";
      }

      const der = src.AsnSerializer.serialize(new Test());
      assert.strictEqual(Buffer.from(der).toString("hex"), "3006820474657374");

      const obj = src.AsnParser.parse(der, Test);
      assert.strictEqual(obj.value, "test");
    });
  });

  // TODO temporary disabled
  // describe("Convertible", () => {
  //   it("correct", () => {
  //     class Test implements src.IAsnConvertible {
  //       public value = "";
  //       public fromASN(asn: asn1js.Utf8String): this {
  //         this.value = asn.valueBlock.value;
  //         return this;
  //       }
  //       public toASN(): asn1js.Utf8String {
  //         return new asn1js.Utf8String({ value: this.value });
  //       }

  //       public toSchema(name: string): asn1js.Utf8String {
  //         return new asn1js.Utf8String({ name });
  //       }
  //     }

  //     const obj1 = new Test();
  //     obj1.value = "test";

  //     const der = src.AsnSerializer.serialize(obj1);
  //     assert.strictEqual(Buffer.from(der).toString("hex"), "0c0474657374");

  //     const obj2 = src.AsnParser.parse(der, Test);
  //     assert.strictEqual(obj1.value, obj2.value);
  //   });
  // });

  it("optional property", () => {
    class Test {
      @src.AsnProp({ type: src.AsnPropTypes.Utf8String, optional: true })
      public opt?: string;
      @src.AsnProp({ type: src.AsnPropTypes.Integer })
      public value = 1;
    }

    const obj1 = new Test();
    const der = src.AsnSerializer.serialize(obj1);
    assert.strictEqual(Buffer.from(der).toString("hex"), "3003020101");

    const obj2 = src.AsnParser.parse(der, Test);
    assert.strictEqual(obj2.opt, undefined);
    assert.strictEqual(obj2.value, 1);
  });

  describe("REPEATED", () => {
    describe("PRIMITIVE", () => {
      it("SET", () => {
        class Test {
          @src.AsnProp({ type: src.AsnPropTypes.Integer, repeated: "set" })
          public values = [1, 2, 3, 4, 5];
        }

        const obj1 = new Test();
        const der = src.AsnSerializer.serialize(obj1);
        assert.strictEqual(
          Buffer.from(der).toString("hex"),
          "3011310f020101020102020103020104020105",
        );

        const obj2 = src.AsnParser.parse(der, Test);
        assert.strictEqual(obj2.values.join(""), "12345");
      });
      it("SEQUENCE", () => {
        class Test {
          @src.AsnProp({ type: src.AsnPropTypes.Integer, repeated: "sequence" })
          public values = [1, 2, 3, 4, 5];
        }

        const obj1 = new Test();
        const der = src.AsnSerializer.serialize(obj1);
        assert.strictEqual(
          Buffer.from(der).toString("hex"),
          "3011300f020101020102020103020104020105",
        );

        const obj2 = src.AsnParser.parse(der, Test);
        assert.strictEqual(obj2.values.join(""), "12345");
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
          @src.AsnProp({ type: Child, repeated: "set" })
          public values: Child[] = [];
        }

        const obj1 = new Test();
        obj1.values.push(new Child(1));
        obj1.values.push(new Child(2));
        const der = src.AsnSerializer.serialize(obj1);
        assert.strictEqual(Buffer.from(der).toString("hex"), "300c310a30030201013003020102");

        const obj2 = src.AsnParser.parse(der, Test);
        assert.strictEqual(obj2.values.length, 2);
        assert.strictEqual(obj2.values[0].value, 1);
        assert.strictEqual(obj2.values[1].value, 2);
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
          @src.AsnProp({ type: Child, repeated: "sequence" })
          public values: Child[] = [];
        }

        const obj1 = new Test();
        obj1.values.push(new Child(1));
        obj1.values.push(new Child(2));
        const der = src.AsnSerializer.serialize(obj1);
        assert.strictEqual(Buffer.from(der).toString("hex"), "300c300a30030201013003020102");

        const obj2 = src.AsnParser.parse(der, Test);
        assert.strictEqual(obj2.values.length, 2);
        assert.strictEqual(obj2.values[0].value, 1);
        assert.strictEqual(obj2.values[1].value, 2);
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
    assert.throws(() => {
      src.AsnSerializer.serialize(obj1);
    });
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
        assert.strictEqual(obj.value, 1);
      });
      it("ArrayBuffer", () => {
        const obj = src.AsnParser.parse(arrayBuffer, Test);
        assert.strictEqual(obj.value, 1);
      });
      it("ArrayBufferView", () => {
        const obj = src.AsnParser.parse(new Uint8Array(arrayBuffer), Test);
        assert.strictEqual(obj.value, 1);
      });
      it("ArrayBufferView", () => {
        assert.throws(() => {
          src.AsnParser.parse([48, 3, 2, 1, 1] as unknown as ArrayBuffer, Test);
        });
      });
    });

    it("throw error on wrong ASN1 encoded data", () => {
      class Test {
        @src.AsnProp({ type: src.AsnPropTypes.Integer })
        public value = 1;
      }
      assert.throws(() => {
        src.AsnParser.parse(Buffer.from("010506", "hex"), Test);
      });
    });
    it("throw error on if schema doesn't match to ASN1 structure", () => {
      class Test {
        @src.AsnProp({ type: src.AsnPropTypes.Integer })
        public value = 1;
      }
      assert.throws(() => {
        src.AsnParser.parse(Buffer.from("010101", "hex"), Test);
      });
    });
  });

  describe("Repeated SET using AsnType decorator", () => {
    @src.AsnType({ type: src.AsnTypeTypes.Set, itemType: src.AsnPropTypes.ObjectIdentifier })
    class Test extends src.AsnArray<string> {}

    const testHex = "310c06042a030405060453040506";

    it("serialize", () => {
      const obj = new Test(["1.2.3.4.5", "2.3.4.5.6"]);
      const buf = src.AsnSerializer.serialize(obj);
      assertBuffer(Buffer.from(buf), Buffer.from(testHex, "hex"));
    });
    it("parse", () => {
      const obj = src.AsnParser.parse(new Uint8Array(Buffer.from(testHex, "hex")).buffer, Test);
      assert.strictEqual(obj.join(", "), "1.2.3.4.5, 2.3.4.5.6");
      assert.strictEqual(obj instanceof Test, true);
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

      assert.strictEqual(test.value, 66051);
    });

    it("parse 4 bytes INTEGER", () => {
      @src.AsnType({ type: src.AsnTypeTypes.Choice })
      class Test {
        @src.AsnProp({ type: src.AsnPropTypes.Integer })
        public value!: number;
      }

      const buf = Buffer.from("020401020304", "hex");
      const test = src.AsnConvert.parse(buf, Test);

      assert.strictEqual(test.value, 16909060);
    });

    it("parse more than 4 bytes INTEGER", () => {
      @src.AsnType({ type: src.AsnTypeTypes.Choice })
      class Test {
        @src.AsnProp({ type: src.AsnPropTypes.Integer })
        public value!: number | bigint;
      }

      const buf = Buffer.from("020f0102030405060708090a0b0c0d0e0f01", "hex");
      const test = src.AsnConvert.parse(buf, Test);

      assert.strictEqual(test.value, 5233100606242806050955395731361295n);
    });
  });
});

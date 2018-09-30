const asn1js = require("asn1js");
import * as assert from "assert";
import { Asn1Prop, Asn1PropTypes, Asn1Type, Asn1TypeTypes } from "../src";
import * as Converters from "../src/converters";
import { Asn1Parser } from "../src/parser";
import { Asn1Serializer } from "../src/serializer";

function assertBuffer(actual: Buffer, expected: Buffer) {
  assert.equal(Buffer.compare(actual, expected), 0,
    `Buffers are not equal.\n\tActual:   ${actual.toString("hex")}\n\tExpected: ${expected.toString("hex")}`);
}

context("Test", () => {

  context("Default value", () => {
    class Test {
      @Asn1Prop({ type: Asn1PropTypes.Integer, defaultValue: 0 })
      public version = 0;
    }
    context("serialize", () => {
      it("not equal to default", () => {
        const obj = new Test();
        obj.version = 1;

        const res = Buffer.from(Asn1Serializer.serialize(obj));
        assertBuffer(res, Buffer.from([48, 3, 2, 1, 1]));
      });
      it("equal to default", () => {
        const obj = new Test();
        obj.version = 0;

        const res = Buffer.from(Asn1Serializer.serialize(obj));
        assertBuffer(res, Buffer.from("3000", "hex"));
      });
    });
  });

  context("CHOICE", () => {

    context("CONTEXT-SPECIFIC", () => {

      class Child {
        @Asn1Prop({ type: Asn1PropTypes.Integer })
        public value = 2;
        @Asn1Prop({ type: Asn1PropTypes.Utf8String })
        public text = "test";
      }

      @Asn1Type({ type: Asn1TypeTypes.Choice })
      class Test {
        @Asn1Prop({ type: Asn1PropTypes.OctetString, context: 0, implicit: true })
        public select1?: ArrayBuffer;
        @Asn1Prop({ type: Asn1PropTypes.Utf8String, context: 1 })
        public select2?: string;
        @Asn1Prop({ type: Asn1PropTypes.Integer, context: 2 })
        public select3?: number;
        @Asn1Prop({ type: Child, context: 3, implicit: true })
        public select4?: Child;
      }
      context("EXPLICIT", () => {
        it("serialize", () => {
          const obj = new Test();
          obj.select2 = "test";
          const buf = Asn1Serializer.serialize(obj);
          assertBuffer(Buffer.from(buf), Buffer.from("a1060c0474657374", "hex"));
        });
        it("parse", () => {
          const obj = Asn1Parser.parse(Buffer.from("a1060c0474657374", "hex"), Test);
          assert.equal(obj.select2, "test");
        });
      });
      context("IMPLICIT", () => {
        context("Primitive", () => {
          it("serialize", () => {
            const obj = new Test();
            obj.select1 = new Uint8Array([1, 2, 3, 4, 5]).buffer;
            const buf = Asn1Serializer.serialize(obj);
            assertBuffer(Buffer.from(buf), Buffer.from("80050102030405", "hex"));
          });
          it("parse", () => {
            const obj = Asn1Parser.parse(new Uint8Array(Buffer.from("80050102030405", "hex")).buffer, Test);
            assert.equal(obj.select1!.byteLength, 5);
          });
        });
        context("Constructed", () => {
          const der = Buffer.from("a3090201020c0474657374", "hex");
          it("stringify", () => {
            const obj = new Test();
            obj.select4 = new Child();

            const buf = Asn1Serializer.serialize(obj);
            assert.equal(Buffer.from(buf).toString("hex"), der.toString("hex"));
          });
          it("parse", () => {
            const obj = Asn1Parser.parse(new Uint8Array(der).buffer, Test);
            assert.equal(!!obj.select4, true);
            assert.equal(obj.select4!.text, "test");
            assert.equal(obj.select4!.value, 2);
          });
        });
      });
    });

    context("PRIMITIVES", () => {
      @Asn1Type({ type: Asn1TypeTypes.Choice })
      class Choice {
        @Asn1Prop({ type: Asn1PropTypes.Integer })
        public numValue!: number;
        @Asn1Prop({ type: Asn1PropTypes.Boolean })
        public boolValue!: boolean;
        @Asn1Prop({ type: Asn1PropTypes.ObjectIdentifier })
        public oidValue!: string;
      }
      it("serialize", () => {
        const obj = new Choice();
        obj.oidValue = "1.2.3";

        const res = Buffer.from(Asn1Serializer.serialize(obj));
        assertBuffer(res, Buffer.from("06022a03", "hex"));
      });
      it("parse", () => {
        const obj = Asn1Parser.parse(new Uint8Array(Buffer.from("06022a03", "hex")).buffer, Choice);
        assert.equal(obj.oidValue, "1.2.3");
      });
    });

    it("throw error if choice doesn't have as min one value", () => {
      @Asn1Type({ type: Asn1TypeTypes.Choice })
      class Test {
        @Asn1Prop({ type: Asn1PropTypes.Integer })
        public case1?: number;
        @Asn1Prop({ type: Asn1PropTypes.Utf8String })
        public case2?: string;
      }

      const obj1 = new Test();
      assert.throws(() => {
        Asn1Serializer.serialize(obj1);
      });
    });
  });

  context("Converter", () => {
    function test(cls: any, hex: string, expected: any, assertCb?: (value: any, excepted: any) => void) {
      it("serialize", () => {
        const obj = new cls();
        obj.value = expected;
        const res = Buffer.from(Asn1Serializer.serialize(obj));
        assertBuffer(res, Buffer.from(hex, "hex"));
      });
      it("parse", () => {
        const obj = Asn1Parser.parse(
          new Uint8Array(Buffer.from(hex, "hex")).buffer,
          cls,
        ) as any;
        // console.log(obj);
        if (assertCb) {
          assertCb(obj.value, expected);
        } else {
          assert.equal(obj.value, expected);
        }
      });
    }
    context("Default", () => {
      context("IntegerConverter", () => {
        class Test {
          @Asn1Prop({ type: Asn1PropTypes.Integer })
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
          @Asn1Prop({ type: Asn1PropTypes.Boolean })
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
          @Asn1Prop({ type: Asn1PropTypes.ObjectIdentifier })
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
          @Asn1Prop({ type: Asn1PropTypes.OctetString })
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
          @Asn1Prop({ type: Asn1PropTypes.Any })
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
          @Asn1Prop({ type: Asn1PropTypes.Enumerated })
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
          @Asn1Prop({ type: Asn1PropTypes.Utf8String })
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
          @Asn1Prop({ type: Asn1PropTypes.BmpString })
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
          @Asn1Prop({ type: Asn1PropTypes.UniversalString })
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
          @Asn1Prop({ type: Asn1PropTypes.NumericString })
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
          @Asn1Prop({ type: Asn1PropTypes.PrintableString })
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
          @Asn1Prop({ type: Asn1PropTypes.TeletexString })
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
          @Asn1Prop({ type: Asn1PropTypes.VideotexString })
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
          @Asn1Prop({ type: Asn1PropTypes.IA5String })
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
          @Asn1Prop({ type: Asn1PropTypes.GraphicString })
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
          @Asn1Prop({ type: Asn1PropTypes.VisibleString })
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
          @Asn1Prop({ type: Asn1PropTypes.GeneralString })
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
          @Asn1Prop({ type: Asn1PropTypes.CharacterString })
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
          @Asn1Prop({ type: Asn1PropTypes.Integer, converter: Converters.AsnIntegerArrayBufferConverter })
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
        @Asn1Prop({ type: Asn1PropTypes.Integer })
        public value = 1;
      }

      const obj1 = new Test();
      const der = Asn1Serializer.serialize(obj1);
      assert.equal(Buffer.from(der).toString("hex"), "3003020101");

      const obj2 = Asn1Parser.parse(der, Test);
      assert.equal(obj2.value, 1);
    });
    it("SET", () => {
      @Asn1Type({ type: Asn1TypeTypes.Set })
      class Test {
        @Asn1Prop({ type: Asn1PropTypes.Integer })
        public value = 1;
      }

      const obj1 = new Test();
      const der = Asn1Serializer.serialize(obj1);
      assert.equal(Buffer.from(der).toString("hex"), "3103020101");

      const obj2 = Asn1Parser.parse(der, Test);
      assert.equal(obj2.value, 1);
    });
    it("child schema ", () => {
      class TbsCertificate {
        public static VERSION = 0;

        @Asn1Prop({
          type: Asn1PropTypes.Integer,
          defaultValue: TbsCertificate.VERSION,
          context: 0,
        })
        public version = 2;
      }

      class Certificate {
        @Asn1Prop({ type: TbsCertificate })
        public tbs = new TbsCertificate();
      }

      const cert = new Certificate();
      const buf = Asn1Serializer.serialize(cert);
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
        @Asn1Prop({
          type: Asn1PropTypes.OctetString,
          context: 0,
          implicit: true,
        })
        public value!: ArrayBuffer;
      }

      it("serialize", () => {
        const obj = new Test();
        obj.value = new Uint8Array([1, 2, 3, 4, 5]).buffer;
        const buf = Asn1Serializer.serialize(obj);
        assertBuffer(Buffer.from(buf), Buffer.from("300780050102030405", "hex"));
      });

      it("parse", () => {
        const obj = Asn1Parser.parse(new Uint8Array(Buffer.from("300780050102030405", "hex")).buffer, Test);
        assert.equal(obj.value.byteLength, 5);
      });

    });

    context("EXPLICIT", () => {

      class Test {
        @Asn1Prop({
          type: Asn1PropTypes.OctetString,
          context: 0,
        })
        public value!: ArrayBuffer;
      }

      it("serialize", () => {
        const obj = new Test();
        obj.value = new Uint8Array([1, 2, 3, 4, 5]).buffer;
        const buf = Asn1Serializer.serialize(obj);
        assertBuffer(Buffer.from(buf), Buffer.from("3009a00704050102030405", "hex"));
      });

      it("parse", () => {
        const obj = Asn1Parser.parse(new Uint8Array(Buffer.from("3009a00704050102030405", "hex")).buffer, Test);
        assert.equal(obj.value.byteLength, 5);
      });

    });

  });

  context("BitString", () => {
    context("EXPLICIT", () => {
      it("unused bits 0", () => {
        class Test {
          @Asn1Prop({ type: Asn1PropTypes.BitString })
          public value = new Uint8Array([255, 1]).buffer;
        }
        const der = Asn1Serializer.serialize(new Test());
        assert.equal(Buffer.from(der).toString("hex"), "3005030300ff01");

        const obj = Asn1Parser.parse(der, Test);
        assert.equal(obj.value.byteLength, 2);
      });
    });
    context("IMPLICIT", () => {
      it("unused bits 0", () => {
        class Test {
          @Asn1Prop({ type: Asn1PropTypes.BitString, context: 0, implicit: true })
          public value = new Uint8Array([255, 1]).buffer;
        }
        const der = Asn1Serializer.serialize(new Test());
        assert.equal(Buffer.from(der).toString("hex"), "3005800300ff01");

        const obj = Asn1Parser.parse(der, Test);
        assert.equal(obj.value.byteLength, 2);
      });
    });
  });

  context("IA5String", () => {
    it("IMPLICIT", () => {
      class Test {

        @Asn1Prop({ type: Asn1PropTypes.IA5String, context: 2, implicit: true })
        public value = "test";
      }

      const der = Asn1Serializer.serialize(new Test());
      assert.equal(Buffer.from(der).toString("hex"), "3006820474657374");

      const obj = Asn1Parser.parse(der, Test);
      assert.equal(obj.value, "test");
    });
  });

  context("Convertible", () => {
    it("correct", () => {
      class Test implements IAsn1Convertible {
        public value = "";
        public fromASN(asn: any): this {
          this.value = asn.valueBlock.value;
          return this;
        }
        public toASN(): any {
          return new asn1js.Utf8String({ value: this.value });
        }
      }

      const obj1 = new Test();
      obj1.value = "test";

      const der = Asn1Serializer.serialize(obj1);
      assert.equal(Buffer.from(der).toString("hex"), "0c0474657374");

      const obj2 = Asn1Parser.parse(der, Test);
      assert.equal(obj1.value, obj2.value);
    });
  });

  it("optional property", () => {
    class Test {
      @Asn1Prop({ type: Asn1PropTypes.Utf8String, optional: true })
      public opt?: string;
      @Asn1Prop({ type: Asn1PropTypes.Integer })
      public value = 1;
    }

    const obj1 = new Test();
    const der = Asn1Serializer.serialize(obj1);
    assert.equal(Buffer.from(der).toString("hex"), "3003020101");

    const obj2 = Asn1Parser.parse(der, Test);
    assert.equal(obj2.opt, undefined);
    assert.equal(obj2.value, 1);
  });

  context("REPEATED", () => {
    it("PRIMITIVE", () => {
      class Test {
        @Asn1Prop({ type: Asn1PropTypes.Integer, repeated: true })
        public values = [1, 2, 3, 4, 5];
      }

      const obj1 = new Test();
      const der = Asn1Serializer.serialize(obj1);
      assert.equal(Buffer.from(der).toString("hex"), "300f020101020102020103020104020105");

      const obj2 = Asn1Parser.parse(der, Test);
      assert.equal(obj2.values.join(""), "12345");
    });
    it("CONSTRUCTED", () => {
      class Child {
        @Asn1Prop({ type: Asn1PropTypes.Integer })
        public value = 0;
        constructor(value?: number) {
          if (value !== undefined) {
            this.value = value;
          }
        }
      }
      class Test {
        @Asn1Prop({ type: Child, repeated: true })
        public values: Child[] = [];
      }

      const obj1 = new Test();
      obj1.values.push(new Child(1));
      obj1.values.push(new Child(2));
      const der = Asn1Serializer.serialize(obj1);
      assert.equal(Buffer.from(der).toString("hex"), "300a30030201013003020102");

      const obj2 = Asn1Parser.parse(der, Test);
      assert.equal(obj2.values.length, 2);
      assert.equal(obj2.values[0].value, 1);
      assert.equal(obj2.values[1].value, 2);
    });
  });

  it("throw error on unsupported type of Asn1Type", () => {
    @Asn1Type({ type: 5 })
    class Test {
      @Asn1Prop({ type: Asn1PropTypes.Integer })
      public value = 1;
    }

    const obj1 = new Test();
    assert.throws(() => {
      Asn1Serializer.serialize(obj1);
    });
  });

  context("Parse", () => {

    context("incoming buffers", () => {
      class Test {
        @Asn1Prop({ type: Asn1PropTypes.Integer })
        public value = 1;
      }
      const arrayBuffer = new Uint8Array([48, 3, 2, 1, 1]).buffer;

      it("Buffer", () => {
        const obj = Asn1Parser.parse(Buffer.from(arrayBuffer), Test);
        assert.equal(obj.value, 1);
      });
      it("ArrayBuffer", () => {
        const obj = Asn1Parser.parse(arrayBuffer, Test);
        assert.equal(obj.value, 1);
      });
      it("ArrayBufferView", () => {
        const obj = Asn1Parser.parse(new Uint8Array(arrayBuffer), Test);
        assert.equal(obj.value, 1);
      });
      it("ArrayBufferView", () => {
        assert.throws(() => {
          Asn1Parser.parse([48, 3, 2, 1, 1] as any, Test);
        });
      });
    });

    it("throw error on wrong ASN1 encoded data", () => {
      class Test {
        @Asn1Prop({ type: Asn1PropTypes.Integer })
        public value = 1;
      }
      assert.throws(() => {
        Asn1Parser.parse(Buffer.from("010506", "hex"), Test);
      });
    });
    it("throw error on if schema doesn't match to ASN1 structure", () => {
      class Test {
        @Asn1Prop({ type: Asn1PropTypes.Integer })
        public value = 1;
      }
      assert.throws(() => {
        Asn1Parser.parse(Buffer.from("010101", "hex"), Test);
      });
    });
  });

});

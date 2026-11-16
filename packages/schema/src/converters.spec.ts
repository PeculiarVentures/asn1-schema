import * as asn1js from "asn1js";
import { describe, expect, it } from "vitest";
import { AsnAnyConverter, AsnConstructedOctetStringConverter, AsnConvert, AsnGeneralizedTimeConverter, AsnIntegerConverter, AsnProp, AsnPropTypes, AsnUTCTimeConverter, OctetString } from "./index";

describe("converters", () => {
  describe("Integer", () => {
    class Test {
      @AsnProp({ type: AsnPropTypes.Integer })
      public value!: string | number;
    }

    // Fixed DER fixtures cover sign padding, the number/string parse boundary,
    // the safe integer limit, and values larger than 64 bits.
    const integers = [
      ["0", "020100"],
      ["127", "02017f"],
      ["128", "02020080"],
      ["-128", "020180"],
      ["-129", "0202ff7f"],
      ["-32767", "02028001"],
      ["8388607", "02037fffff"],
      ["8388608", "020400800000"],
      ["-8388608", "0203800000"],
      ["-8388609", "0204ff7fffff"],
      ["9007199254740991", "02071fffffffffffff"],
      ["9007199254740992", "020720000000000000"],
      ["9007199254740993", "020720000000000001"],
      ["-9007199254740991", "0207e0000000000001"],
      ["-9007199254740992", "0207e0000000000000"],
      ["-9007199254740993", "0207dfffffffffffff"],
      ["18446744073709551616", "0209010000000000000000"],
      ["-18446744073709551616", "0209ff0000000000000000"],
      ["123456789012345678901234567890", "020d018ee90ff6c373e0ee4e3f0ad2"],
      ["-123456789012345678901234567890", "020dfe7116f0093c8c1f11b1c0f52e"],
    ];

    it.each(integers)("serializes decimal string %s exactly", (value, hex) => {
      const asn = AsnIntegerConverter.toASN(value);
      expect(Buffer.from(asn.toBER()).toString("hex")).toBe(hex);
    });

    it.each(integers)("serializes a directly assigned decimal string %s", (value, hex) => {
      const obj = new Test();
      obj.value = value;
      const integer = Buffer.from(hex, "hex");
      const expected = Buffer.concat([Buffer.from([0x30, integer.length]), integer]);

      expect(Buffer.from(AsnConvert.serialize(obj))).toEqual(expected);
    });

    it.each(integers)("preserves %s when parsing and serializing", (value, hex) => {
      const integer = Buffer.from(hex, "hex");
      const der = Buffer.concat([Buffer.from([0x30, integer.length]), integer]);
      const obj = AsnConvert.parse(der, Test);

      expect(obj.value).toBe(integer[1] >= 4 ? value : Number(value));
      expect(Buffer.from(AsnConvert.serialize(obj))).toEqual(der);
    });

    it.each(integers.filter(([value]) => Number.isSafeInteger(Number(value))))("preserves numeric input %s", (value, hex) => {
      const asn = AsnIntegerConverter.toASN(Number(value));
      expect(Buffer.from(asn.toBER()).toString("hex")).toBe(hex);
    });

    it.each([
      [2 ** 53, "020720000000000000"],
      [2 ** 60, "02081000000000000000"],
      [2 ** 64, "0209010000000000000000"],
    ] as const)("preserves integer number input %s above the safe integer limit", (value, hex) => {
      const asn = AsnIntegerConverter.toASN(value);
      expect(Buffer.from(asn.toBER()).toString("hex")).toBe(hex);
    });

    it.each([
      ["1e3", "020203e8"],
      ["1e20", "0209056bc75e2d63100000"],
      ["1.0", "020101"],
      ["9007199254740992.0", "020720000000000000"],
      ["9007199254740993.0", "020720000000000000"],
      ["18446744073709551616.0", "0209010000000000000000"],
      ["9007199254740993e0", "020720000000000000"],
      [" 42 ", "02012a"],
      ["0x10", "020110"],
      ["", "020100"],
      [" \t\n", "020100"],
    ])("preserves legacy numeric string input %s", (value, hex) => {
      const asn = AsnIntegerConverter.toASN(value);
      expect(Buffer.from(asn.toBER()).toString("hex")).toBe(hex);
    });

    it.each(["invalid", "1.5", "1e-3", "Infinity", "1e309", "1_000"])("rejects invalid numeric string input %s", (value) => {
      expect(() => AsnIntegerConverter.toASN(value)).toThrow(RangeError);
    });

    it.each(["2147483647", "9007199254740992", "-9007199254740992", "18446744073709551616", "-18446744073709551616", " -0 "])(
      "preserves legacy Integer metadata for exactly representable decimal string %s",
      (value) => {
        const asn = AsnIntegerConverter.toASN(value);
        const legacy = new asn1js.Integer({ value: +value });

        expect(asn.valueBlock.valueDec).toBe(legacy.valueBlock.valueDec);
        expect(asn.valueBlock.isHexOnly).toBe(legacy.valueBlock.isHexOnly);
        expect(asn.toJSON()).toEqual(legacy.toJSON());
      },
    );

    it.each([
      [" +9007199254740993 ", "020720000000000001"],
      [" \t-9007199254740993\n", "0207dfffffffffffff"],
    ])("serializes signed decimal string %s exactly", (value, hex) => {
      const asn = AsnIntegerConverter.toASN(value);
      expect(Buffer.from(asn.toBER()).toString("hex")).toBe(hex);
    });

    it.each([
      [(1n << 1024n).toString(), `02818101${"00".repeat(128)}`],
      [(-(1n << 1024n)).toString(), `028181ff${"00".repeat(128)}`],
    ])("serializes decimal string %s beyond the finite Number range exactly", (value, hex) => {
      const asn = AsnIntegerConverter.toASN(value);
      expect(Number.isFinite(+value)).toBe(false);
      expect(Buffer.from(asn.toBER()).toString("hex")).toBe(hex);
      expect(asn.toBigInt()).toBe(BigInt(value));
    });

    it("rejects undefined runtime input", () => {
      expect(() => AsnIntegerConverter.toASN(undefined as unknown as number)).toThrow(RangeError);
    });

    it("rejects holes in repeated INTEGER properties", () => {
      class RepeatedTest {
        @AsnProp({ type: AsnPropTypes.Integer, repeated: "sequence" })
        public values: number[] = [1, 2];
      }
      const obj = new RepeatedTest();
      delete obj.values[0];

      expect(() => AsnConvert.serialize(obj)).toThrow(RangeError);
    });

    it.each([
      [null, "020100"],
      [false, "020100"],
      [true, "020101"],
    ] as const)("preserves numeric coercion for runtime input %s", (value, hex) => {
      const asn = AsnIntegerConverter.toASN(value as unknown as number);
      expect(Buffer.from(asn.toBER()).toString("hex")).toBe(hex);
    });
  });

  describe("Any", () => {
    it("null", () => {
      const asn = AsnAnyConverter.toASN(null);

      const der = asn.toBER();
      expect(Buffer.from(der).toString("hex")).toBe("0500");

      const value = AsnAnyConverter.fromASN(asn);
      expect(value).toBe(null);
    });
    it("Integer", () => {
      const asn = AsnAnyConverter.toASN(new Uint8Array([2, 1, 1]).buffer);

      const der = asn.toBER();
      expect(Buffer.from(der).toString("hex")).toBe("020101");

      const value = AsnAnyConverter.fromASN(asn);
      expect(value).toBeTruthy();
      expect(value!.byteLength).toBe(3);
    });
    it("Throw error on wrong encoded value", () => {
      expect(() => {
        AsnAnyConverter.toASN(new Uint8Array([2, 5, 1]).buffer); // wrong length
      }).toThrow();
    });
  });

  describe("GeneralizedTime", () => {
    const dateNum = 1537560204455;
    it("correct", () => {
      const asn = AsnGeneralizedTimeConverter.toASN(new Date(dateNum));

      const der = asn.toBER();
      expect(Buffer.from(der).toString("hex")).toBe("181332303138303932313230303332342e3435355a");

      const value = AsnGeneralizedTimeConverter.fromASN(asn);
      expect(value.getTime()).toBe(dateNum);
    });
  });

  describe("UTCTime", () => {
    const dateNum = 1537560204000;
    it("correct", () => {
      const asn = AsnUTCTimeConverter.toASN(new Date(dateNum));

      const der = asn.toBER();
      expect(Buffer.from(der).toString("hex")).toBe("170d3138303932313230303332345a");

      const value = AsnUTCTimeConverter.fromASN(asn);
      expect(value.getTime()).toBe(dateNum);
    });
  });

  describe("ConstructedOctetStringConverter", () => {
    const buffer = Buffer.from("12345", "ascii");
    it("correct", () => {
      const asn = AsnConstructedOctetStringConverter.toASN(new OctetString(buffer));

      const der = asn.toBER();
      expect(Buffer.from(der).toString("hex")).toBe("04053132333435");

      const value = AsnConstructedOctetStringConverter.fromASN(asn);
      expect(Buffer.from(value.buffer)).not.toBe(buffer);
    });
  });
});

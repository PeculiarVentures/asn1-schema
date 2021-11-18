import * as assert from "assert";
import { Convert } from "pvtsutils";
import * as src from "../src";

context("BER", () => {

  context("IdentifierOctets", () => {

    context("parse", () => {

      context("tag number", () => {
        it("5", () => {
          const raw = new Uint8Array([0x05, 0x00]);
          const ber = src.BERIdentifierOctets.fromBER(raw);
          assert.strictEqual(ber.tagNumber, 5);
        });
        it("16513", () => {
          const raw = new Uint8Array([0x3f, 0x81, 0x81, 0x01, 0x00]);
          const ber = src.BERIdentifierOctets.fromBER(raw);
          assert.strictEqual(ber.tagNumber, 16513);
        });
        it("2113665", () => {
          const raw = new Uint8Array([0x3f, 0x81, 0x81, 0x81, 0x01, 0x00]);
          const ber = src.BERIdentifierOctets.fromBER(raw);
          assert.strictEqual(ber.tagNumber, 2113665);
        });
      });
    });
  });

  context("Length octets", () => {

    context("parse", () => {

      it("shot form", () => {
        const raw = new Uint8Array([0x05]);
        const ber = src.BERLengthOctets.fromBER(raw);
        assert.strictEqual(ber.value, 5);
        assert.strictEqual(ber.type, src.BERLengthType.short);
      });

      it("long form", () => {
        const raw = new Uint8Array([0x82, 0x2A, 0x74]);
        const ber = src.BERLengthOctets.fromBER(raw);
        assert.strictEqual(ber.value, 10868);
        assert.strictEqual(ber.type, src.BERLengthType.long);
      });

      it("indefinite form", () => {
        const raw = new Uint8Array([0x80]);
        const ber = src.BERLengthOctets.fromBER(raw);
        assert.strictEqual(ber.value, -1);
        assert.strictEqual(ber.type, src.BERLengthType.indefinite);
      });

    });

  });

  context("Objects", () => {

    context("parse", () => {

      it("SEQUENCE with children", () => {
        const raw = Convert.FromHex("300D06096086480165030402010500");
        const asn = src.AsnConverter.parse(raw);
        assert.strictEqual(asn.identifier.constructed, true);
        assert.strictEqual(asn.length.value, 13);
        assert.strictEqual(asn.content.items.length, 2);
      });

    });

  });

});

context("ObjectIdentifierConverter", () => {

  it("test", () => {
    const raw = new Uint8Array([0x2A, 0x86, 0x48, 0x86, 0xF7, 0x0D, 0x01, 0x09, 0x05]);
    const oid = src.ObjectIdentifierConverter.toString(raw);
    console.log(oid);
    console.log(Convert.ToHex(src.ObjectIdentifierConverter.fromString(oid)));
  });

});

context("Relative object identifier", () => {

  it("test", () => {
    const raw = new Uint8Array([0x0D, 0x04, 0xC2, 0x7B, 0x03, 0x02]);
    const rid = src.AsnConverter.parse(raw, src.AsnRelativeObjectIdentifier);
    console.log(rid.value);
    const rid2 = new src.AsnRelativeObjectIdentifier();
    rid.value = "8571 3 2";
    console.log(Convert.ToHex(rid.content.view));
  });

});

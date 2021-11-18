import * as assert from "assert";
import { Convert } from "pvtsutils";
import * as src from "@peculiar/asn1";
import { randomBytes } from "crypto";

context("ASN", () => {

  it("Null", () => {
    const asn = new src.AsnNull();

    const raw = src.AsnConverter.serialize(asn);
    assert.strictEqual(Convert.ToHex(raw), "0500");
  });

  it("Boolean", () => {
    const asn = new src.AsnBoolean(true);

    let raw = src.AsnConverter.serialize(asn);
    assert.strictEqual(Convert.ToHex(raw), "010101");

    asn.value = false;
    raw = src.AsnConverter.serialize(asn);
    assert.strictEqual(Convert.ToHex(raw), "010100");
  });

  it("Integer", () => {
    const asn = new src.AsnInteger(12345);

    let raw = src.AsnConverter.serialize(asn);
    assert.strictEqual(Convert.ToHex(raw), "02023039");

    asn.value = 3809748987247620721362n;
    raw = src.AsnConverter.serialize(asn);
    assert.strictEqual(Convert.ToHex(raw), "020a00ce86e356fc8a9f0ad2");

    asn.value = -1234567890n;
    raw = src.AsnConverter.serialize(asn);
    assert.strictEqual(Convert.ToHex(raw), "0204b669fd2e");
  });

  it("ObjectIdentifier", () => {
    const asn = new src.AsnObjectIdentifier("1.2.3.4.5");

    let raw = src.AsnConverter.serialize(asn);
    assert.strictEqual(Convert.ToHex(raw), "06042a030405");

    asn.value = "2.3.4.5";
    raw = src.AsnConverter.serialize(asn);
    assert.strictEqual(Convert.ToHex(raw), "0603530405");
  });

  it("Enumerated", () => {
    const asn = new src.AsnEnumerated(1);

    let raw = src.AsnConverter.serialize(asn);
    assert.strictEqual(Convert.ToHex(raw), "0a0101");

    asn.value = 2;
    raw = src.AsnConverter.serialize(asn);
    assert.strictEqual(Convert.ToHex(raw), "0a0102");
  });

  context("Strings", () => {
    const enTest = "test";
    const enHello = "hello";
    const ruTest = "тест";

    it("BMPString", () => {
      const asn = new src.AsnBmpString(enTest);

      let raw = src.AsnConverter.serialize(asn);
      assert.strictEqual(Convert.ToHex(raw), "1e080074006500730074");
      assert.strictEqual(asn.value, enTest);

      asn.value = ruTest;
      raw = src.AsnConverter.serialize(asn);
      assert.strictEqual(Convert.ToHex(raw), "1e080442043504410442");
      assert.strictEqual(asn.value, ruTest);
    });

    it("UTF8String", () => {
      const asn = new src.AsnUtf8String(enTest);

      let raw = src.AsnConverter.serialize(asn);
      assert.strictEqual(Convert.ToHex(raw), "0c0474657374");
      assert.strictEqual(asn.value, enTest);

      asn.value = ruTest;
      raw = src.AsnConverter.serialize(asn);
      assert.strictEqual(Convert.ToHex(raw), "0c08d182d0b5d181d182");
      assert.strictEqual(asn.value, ruTest);
    });

    it("IA5String", () => {
      const asn = new src.AsnIA5String(enTest);

      let raw = src.AsnConverter.serialize(asn);
      assert.strictEqual(Convert.ToHex(raw), "160474657374");
      assert.strictEqual(asn.value, enTest);

      asn.value = enHello;
      raw = src.AsnConverter.serialize(asn);
      assert.strictEqual(Convert.ToHex(raw), "160568656c6c6f");
      assert.strictEqual(asn.value, enHello);
    });

    it("CharacterString", () => {
      const asn = new src.AsnCharacterString(enTest);

      let raw = src.AsnConverter.serialize(asn);
      assert.strictEqual(Convert.ToHex(raw), "1d0474657374");
      assert.strictEqual(asn.value, enTest);

      asn.value = enHello;
      raw = src.AsnConverter.serialize(asn);
      assert.strictEqual(Convert.ToHex(raw), "1d0568656c6c6f");
      assert.strictEqual(asn.value, enHello);
    });

    it("GeneralString", () => {
      const asn = new src.AsnGeneralString(enTest);

      let raw = src.AsnConverter.serialize(asn);
      assert.strictEqual(Convert.ToHex(raw), "1b0474657374");
      assert.strictEqual(asn.value, enTest);

      asn.value = enHello;
      raw = src.AsnConverter.serialize(asn);
      assert.strictEqual(Convert.ToHex(raw), "1b0568656c6c6f");
      assert.strictEqual(asn.value, enHello);
    });

    it("GraphicString", () => {
      const asn = new src.AsnGraphicString(enTest);

      let raw = src.AsnConverter.serialize(asn);
      assert.strictEqual(Convert.ToHex(raw), "190474657374");
      assert.strictEqual(asn.value, enTest);

      asn.value = enHello;
      raw = src.AsnConverter.serialize(asn);
      assert.strictEqual(Convert.ToHex(raw), "190568656c6c6f");
      assert.strictEqual(asn.value, enHello);
    });

    it("NumericString", () => {
      const asn = new src.AsnNumericString(enTest);

      let raw = src.AsnConverter.serialize(asn);
      assert.strictEqual(Convert.ToHex(raw), "120474657374");
      assert.strictEqual(asn.value, enTest);

      asn.value = enHello;
      raw = src.AsnConverter.serialize(asn);
      assert.strictEqual(Convert.ToHex(raw), "120568656c6c6f");
      assert.strictEqual(asn.value, enHello);
    });

    it("PrintableString", () => {
      const asn = new src.AsnPrintableString(enTest);

      let raw = src.AsnConverter.serialize(asn);
      assert.strictEqual(Convert.ToHex(raw), "130474657374");
      assert.strictEqual(asn.value, enTest);

      asn.value = enHello;
      raw = src.AsnConverter.serialize(asn);
      assert.strictEqual(Convert.ToHex(raw), "130568656c6c6f");
      assert.strictEqual(asn.value, enHello);
    });

    it("VideotexString", () => {
      const asn = new src.AsnVideotexString(enTest);

      let raw = src.AsnConverter.serialize(asn);
      assert.strictEqual(Convert.ToHex(raw), "150474657374");
      assert.strictEqual(asn.value, enTest);

      asn.value = enHello;
      raw = src.AsnConverter.serialize(asn);
      assert.strictEqual(Convert.ToHex(raw), "150568656c6c6f");
      assert.strictEqual(asn.value, enHello);
    });

    it("VisibleString", () => {
      const asn = new src.AsnVisibleString(enTest);

      let raw = src.AsnConverter.serialize(asn);
      assert.strictEqual(Convert.ToHex(raw), "1a0474657374");
      assert.strictEqual(asn.value, enTest);

      asn.value = enHello;
      raw = src.AsnConverter.serialize(asn);
      assert.strictEqual(Convert.ToHex(raw), "1a0568656c6c6f");
      assert.strictEqual(asn.value, enHello);
    });

    it("TeletexString", () => {
      const asn = new src.AsnTeletexString(enTest);

      let raw = src.AsnConverter.serialize(asn);
      assert.strictEqual(Convert.ToHex(raw), "140474657374");
      assert.strictEqual(asn.value, enTest);

      asn.value = enHello;
      raw = src.AsnConverter.serialize(asn);
      assert.strictEqual(Convert.ToHex(raw), "140568656c6c6f");
      assert.strictEqual(asn.value, enHello);
    });

    it("UniversalString", () => {
      const asn = new src.AsnUniversalString(enTest);

      let raw = src.AsnConverter.serialize(asn);
      assert.strictEqual(Convert.ToHex(raw), "1c1000000074000000650000007300000074");
      assert.strictEqual(asn.value, enTest);

      asn.value = enHello;
      raw = src.AsnConverter.serialize(asn);
      assert.strictEqual(Convert.ToHex(raw), "1c1400000068000000650000006c0000006c0000006f");
      assert.strictEqual(asn.value, enHello);
    });

  });

  context("BitString", () => {

    it("Less then 32bits and with 6 disabled bits", () => {
      const value = new Uint8Array([0xff]);
      const asn = new src.AsnBitString(value, 6);

      let raw = src.AsnConverter.serialize(asn);
      assert.strictEqual(Convert.ToHex(raw), "030206ff");
      assert.strictEqual(Convert.ToHex(asn.value), Convert.ToHex(value));
      assert.strictEqual(asn.unusedBits, 6);

      assert.strictEqual(asn.toString("asn"), "BIT STRING (6 unused bits)\n  '11'B");
    });

    it("Less than 32bits and without disabled bits", () => {
      const value = new Uint8Array([0x0f, 0xff]);
      const asn = new src.AsnBitString(value, 0);

      let raw = src.AsnConverter.serialize(asn);
      assert.strictEqual(Convert.ToHex(raw), "0303000fff");
      assert.strictEqual(Convert.ToHex(asn.value), Convert.ToHex(value));
      assert.strictEqual(asn.unusedBits, 0);

      assert.strictEqual(asn.toString("asn"), "BIT STRING\n  '0000111111111111'B");
    });

    it("More than 32bits", () => {
      const value = randomBytes(16 * 10);
      const asn = new src.AsnBitString(value, 0);

      assert.ok(asn.toString("hex").startsWith("0381a100"));
      assert.strictEqual(Convert.ToHex(asn.value), Convert.ToHex(value));
      assert.strictEqual(asn.unusedBits, 0);

      assert.ok(asn.toString("asn").startsWith("BIT STRING\n"));
      assert.ok(asn.toString("asn").includes("...skipping 48 bytes...\n"));
    });

    it.skip("Constructed", () => {
      const asn = new src.AsnBitString();
      asn.items = [
        new src.AsnBitString(new Uint8Array([1, 2, 3]), 0),
        new src.AsnBitString(new Uint8Array([0xff]), 6),
      ];

      console.log(asn.toString("hex"));
      // assert.ok(asn.toString("hex"));

      assert.strictEqual(asn.toString("asn"), "BIT STRING\n  '0000111111111111'B");
    });

  });

  context("UTCTime", () => {
    it("2021-11-17 14:21:30", () => {
      const utcDate = Date.UTC(2021, 10, 17, 14, 21, 30);
      const asn = new src.AsnUTCTime(new Date(utcDate));

      assert.strictEqual(asn.toString("hex"), "170d3231313131373134323133305a");
      assert.strictEqual(asn.date.toString(), new Date(utcDate).toString());

      assert.strictEqual(asn.toString(), "UTCTime 2021-11-17 14:21:30 UTC");
    });
    context("parse", () => {
      it("2021-11-17T01:02:03Z UTC", () => {
        const asn = src.AsnConverter.parse(Convert.FromHex("170d3231313131373031303230335a"), src.AsnUTCTime);
        assert.strictEqual(asn.date.toISOString(), "2021-11-17T01:02:03.000Z");
      });
      it("2021-11-17T01:02:03 Local", () => {
        const asn = src.AsnConverter.parse(Convert.FromHex("170c323131313137303130323033"), src.AsnUTCTime);
        assert.strictEqual(asn.date.toISOString(), new Date("2021-11-17T01:02:03").toISOString());
      });
      it("2021-11-17T01:02:03+03:00 Local", () => {
        const asn = src.AsnConverter.parse(Convert.FromHex("17113231313131373031303230332b30333030"), src.AsnUTCTime);
        assert.strictEqual(asn.date.toISOString(), new Date("2021-11-16T22:02:03.000Z").toISOString());
      });
      it("2021-11-17T01:02:03-03:30 Local", () => {
        const asn = src.AsnConverter.parse(Convert.FromHex("17113231313131373031303230332d30333330"), src.AsnUTCTime);
        assert.strictEqual(asn.date.toISOString(), new Date("2021-11-17T04:32:03Z").toISOString());
      });
    });
  });

  context("GeneralizedTime", () => {
    it("2021-11-17 14:21:30.3 UTC", () => {
      const utcDate = Date.UTC(2021, 10, 17, 14, 21, 30, 300);
      const asn = new src.AsnGeneralizedTime(new Date(utcDate));

      assert.strictEqual(asn.toString("hex"), "181132303231313131373134323133302e335a");
      assert.strictEqual(asn.date.toString(), new Date(utcDate).toString());

      assert.strictEqual(asn.toString(), "GeneralizedTime 2021-11-17 14:21:30.3 UTC");
    });

    it("2021-11-17 14:21:30.03 UTC", () => {
      const utcDate = Date.UTC(2021, 10, 17, 14, 21, 30, 30);
      const asn = new src.AsnGeneralizedTime(new Date(utcDate));

      assert.strictEqual(asn.toString("hex"), "181232303231313131373134323133302e30335a");
      assert.strictEqual(asn.date.toString(), new Date(utcDate).toString());
    });

    it("2021-11-17 14:21:30.003 UTC", () => {
      const utcDate = Date.UTC(2021, 10, 17, 14, 21, 30, 3);
      const asn = new src.AsnGeneralizedTime(new Date(utcDate));

      assert.strictEqual(asn.toString("hex"), "181332303231313131373134323133302e3030335a");
      assert.strictEqual(asn.date.toString(), new Date(utcDate).toString());
    });

    it("2021-11-17 00:00:00 UTC (midnight)", () => {
      const utcDate = Date.UTC(2021, 10, 17);
      const asn = new src.AsnGeneralizedTime(new Date(utcDate));

      assert.strictEqual(asn.toString("hex"), "180f32303231313131373030303030305a");
      assert.strictEqual(asn.date.toString(), new Date(utcDate).toString());
    });

    context("parse", () => {
      context("UTC", () => {
        it("2021-11-17T01:02:03.004Z", () => {
          const asn = src.AsnConverter.parse(Convert.FromHex("181332303231313131373031303230332e3030345a"), src.AsnGeneralizedTime);
          assert.strictEqual(asn.date.toISOString(), "2021-11-17T01:02:03.004Z");
        });
        it("2021-11-17T01:02:03.04Z", () => {
          const asn = src.AsnConverter.parse(Convert.FromHex("181232303231313131373031303230332e30345a"), src.AsnGeneralizedTime);
          assert.strictEqual(asn.date.toISOString(), "2021-11-17T01:02:03.040Z");
        });
        it("2021-11-17T01:02:03.4Z", () => {
          const asn = src.AsnConverter.parse(Convert.FromHex("181132303231313131373031303230332e345a"), src.AsnGeneralizedTime);
          assert.strictEqual(asn.date.toISOString(), "2021-11-17T01:02:03.400Z");
        });
        it("2021-11-17T01:02:03Z", () => {
          const asn = src.AsnConverter.parse(Convert.FromHex("180f32303231313131373031303230335a"), src.AsnGeneralizedTime);
          assert.strictEqual(asn.date.toISOString(), "2021-11-17T01:02:03.000Z");
        });
      });
      context("local", () => {
        it("2021-11-17T01:02:03.004", () => {
          const asn = src.AsnConverter.parse(Convert.FromHex("181232303231313131373031303230332e303034"), src.AsnGeneralizedTime);
          assert.strictEqual(asn.date.toISOString(), new Date("2021-11-17T01:02:03.004").toISOString());
        });
        it("2021-11-17T01:02:03.04", () => {
          const asn = src.AsnConverter.parse(Convert.FromHex("181132303231313131373031303230332e3034"), src.AsnGeneralizedTime);
          assert.strictEqual(asn.date.toISOString(), new Date("2021-11-17T01:02:03.040").toISOString());
        });
        it("2021-11-17T01:02:03.4", () => {
          const asn = src.AsnConverter.parse(Convert.FromHex("181032303231313131373031303230332e34"), src.AsnGeneralizedTime);
          assert.strictEqual(asn.date.toISOString(), new Date("2021-11-17T01:02:03.400").toISOString());
        });
        it("2021-11-17T01:02:03", () => {
          const asn = src.AsnConverter.parse(Convert.FromHex("180e3230323131313137303130323033"), src.AsnGeneralizedTime);
          assert.strictEqual(asn.date.toISOString(), new Date("2021-11-17T01:02:03").toISOString());
        });
      });
      context("UTC +/- diff", () => {
        it("2021-11-17T01:02:03+03:00", () => {
          const asn = src.AsnConverter.parse(Convert.FromHex("181332303231313131373031303230332b30333030"), src.AsnGeneralizedTime);
          assert.strictEqual(asn.date.toISOString(), new Date("2021-11-16T22:02:03.000Z").toISOString());
        });
        it("2021-11-17T01:02:03-03:30", () => {
          const asn = src.AsnConverter.parse(Convert.FromHex("181732303231313131373031303230332e3030342d30333330"), src.AsnGeneralizedTime);
          assert.strictEqual(asn.date.toISOString(), new Date("2021-11-17T04:32:03.004Z").toISOString());
        });
      });
    });

  });

});
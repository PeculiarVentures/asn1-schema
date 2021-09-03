import * as assert from "assert";
import { Convert } from "pvtsutils";
import * as src from "@peculiar/asn1";

context.only("ASN", () => {

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


});
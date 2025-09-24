import { describe, it, assert } from "vitest";
import { RSAPrivateKey, OtherPrimeInfos, OtherPrimeInfo } from "../src";
import { AsnConvert } from "@peculiar/asn1-schema";

describe("RSA Private Key", () => {
  const privateKeyWithoutPrimeInfoHex =
    "304f020100020400800001020500800000020206008000000003020700800000000004020800800000000000050209008000000000000006020a00800000000000000007020b0080000000000000000008";
  const privateKeyWithPrimeInfoHex =
    "3068020101020400800001020500800000020206008000000003020700800000000004020800800000000000050209008000000000000006020a00800000000000000007020b008000000000000000000830173015020600800000000302050080000002020400800001";

  describe("without PrimeInfo", () => {
    it("serialize", () => {
      const privateKey = new RSAPrivateKey({
        modulus: new Uint8Array([0, 128, 0, 1]).buffer,
        publicExponent: new Uint8Array([0, 128, 0, 0, 2]).buffer,
        privateExponent: new Uint8Array([0, 128, 0, 0, 0, 3]).buffer,
        prime1: new Uint8Array([0, 128, 0, 0, 0, 0, 4]).buffer,
        prime2: new Uint8Array([0, 128, 0, 0, 0, 0, 0, 5]).buffer,
        exponent1: new Uint8Array([0, 128, 0, 0, 0, 0, 0, 0, 6]).buffer,
        exponent2: new Uint8Array([0, 128, 0, 0, 0, 0, 0, 0, 0, 7]).buffer,
        coefficient: new Uint8Array([0, 128, 0, 0, 0, 0, 0, 0, 0, 0, 8]).buffer,
      });

      const der = AsnConvert.serialize(privateKey);

      // SEQUENCE (9 elem)
      //   INTEGER 0
      //   INTEGER 8388609
      //   INTEGER 8388610
      //   INTEGER 8388611
      //   INTEGER 8388612
      //   INTEGER 8388613
      //   INTEGER 8388614
      //   INTEGER 8388615
      //   INTEGER 8388616
      const hex = Buffer.from(der).toString("hex");
      assert.strictEqual(hex, privateKeyWithoutPrimeInfoHex);
    });

    it("parse", () => {
      const der = Buffer.from(privateKeyWithoutPrimeInfoHex, "hex");

      const privateKey = AsnConvert.parse(der, RSAPrivateKey);
      assert.strictEqual(privateKey.version, 0);
      assert.strictEqual(privateKey.modulus.byteLength, 4);
      assert.strictEqual(privateKey.publicExponent.byteLength, 5);
      assert.strictEqual(privateKey.privateExponent.byteLength, 6);
      assert.strictEqual(privateKey.prime1.byteLength, 7);
      assert.strictEqual(privateKey.prime2.byteLength, 8);
      assert.strictEqual(privateKey.exponent1.byteLength, 9);
      assert.strictEqual(privateKey.exponent2.byteLength, 10);
      assert.strictEqual(privateKey.coefficient.byteLength, 11);
    });
  });

  describe("with PrimeInfo", () => {
    it("serialize", () => {
      const privateKey = new RSAPrivateKey({
        version: 1,
        modulus: new Uint8Array([0, 128, 0, 1]).buffer,
        publicExponent: new Uint8Array([0, 128, 0, 0, 2]).buffer,
        privateExponent: new Uint8Array([0, 128, 0, 0, 0, 3]).buffer,
        prime1: new Uint8Array([0, 128, 0, 0, 0, 0, 4]).buffer,
        prime2: new Uint8Array([0, 128, 0, 0, 0, 0, 0, 5]).buffer,
        exponent1: new Uint8Array([0, 128, 0, 0, 0, 0, 0, 0, 6]).buffer,
        exponent2: new Uint8Array([0, 128, 0, 0, 0, 0, 0, 0, 0, 7]).buffer,
        coefficient: new Uint8Array([0, 128, 0, 0, 0, 0, 0, 0, 0, 0, 8]).buffer,
        otherPrimeInfos: OtherPrimeInfos.from([
          new OtherPrimeInfo({
            coefficient: new Uint8Array([0, 128, 0, 1]).buffer,
            exponent: new Uint8Array([0, 128, 0, 0, 2]).buffer,
            prime: new Uint8Array([0, 128, 0, 0, 0, 3]).buffer,
          }),
        ]),
      });
      const der = AsnConvert.serialize(privateKey);

      const hex = Buffer.from(der).toString("hex");
      assert.strictEqual(hex, privateKeyWithPrimeInfoHex);
    });

    it("parse", () => {
      const der = Buffer.from(privateKeyWithPrimeInfoHex, "hex");

      const privateKey = AsnConvert.parse(der, RSAPrivateKey);
      assert.strictEqual(privateKey.version, 1);
      assert.strictEqual(privateKey.otherPrimeInfos?.length, 1);
      assert.strictEqual(privateKey.otherPrimeInfos?.[0].coefficient.byteLength, 4);
      assert.strictEqual(privateKey.otherPrimeInfos?.[0].exponent.byteLength, 5);
      assert.strictEqual(privateKey.otherPrimeInfos?.[0].prime.byteLength, 6);
    });
  });
});

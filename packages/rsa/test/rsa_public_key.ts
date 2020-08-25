import * as assert from "assert";
import { RSAPublicKey } from "../src";
import { AsnConvert } from "@peculiar/asn1-schema";

context("RSA Public Key", () => {

  it("serialize", () => {
    const publicKey = new RSAPublicKey({
      publicExponent: new Uint8Array([1, 0, 1]).buffer,
      modulus: Buffer.from("vqpvdxuyZ6rKYnWTj/ZzDBFZAAAlpe5hpoiYHqa2j5kK7v8U5EaPY2bLib9m4B40j+n3FV9xUCGiplWdqMJJKT+4PjGO5E3S4N9kjFhu57noYT7z7302J0sJXeoFbXxlgE+4G55Oxlm52ID2/RJesP5nzcGTriQwoRbrJP5OEt0=", "base64"),
    })

    const der = AsnConvert.serialize(publicKey);

    // SEQUENCE (2 elem)
    //   INTEGER (1023 bit) -4.587926122739843e+307
    //   INTEGER 65537
    const hex = Buffer.from(der).toString("hex");
    assert.strictEqual(hex, "308188028180beaa6f771bb267aaca6275938ff6730c1159000025a5ee61a688981ea6b68f990aeeff14e4468f6366cb89bf66e01e348fe9f7155f715021a2a6559da8c249293fb83e318ee44dd2e0df648c586ee7b9e8613ef3ef7d36274b095dea056d7c65804fb81b9e4ec659b9d880f6fd125eb0fe67cdc193ae2430a116eb24fe4e12dd0203010001");
  });

  it("parse", () => {
    const pem = "MIGJAoGBAL6qb3cbsmeqymJ1k4/2cwwRWQAAJaXuYaaImB6mto+ZCu7/FORGj2Nmy4m/ZuAeNI/p9xVfcVAhoqZVnajCSSk/uD4xjuRN0uDfZIxYbue56GE+8+99NidLCV3qBW18ZYBPuBueTsZZudiA9v0SXrD+Z83Bk64kMKEW6yT+ThLdAgMBAAE=";
    const der = Buffer.from(pem, "base64");

    const publicKey = AsnConvert.parse(der, RSAPublicKey);
    assert.strictEqual(publicKey.publicExponent.byteLength, 3);
    assert.strictEqual(publicKey.modulus.byteLength, 129);
  });
});
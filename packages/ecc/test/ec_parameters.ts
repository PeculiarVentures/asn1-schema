import * as assert from "assert";
import { ECParameters, id_secp256r1 } from "../src";
import { AsnConvert } from "@peculiar/asn1-schema";

context("EC parameters", () => {

  const ecParamsHex = "06082a8648ce3d030107";

  it("serialize", () => {
    const ecParams = new ECParameters({
      namedCurve: id_secp256r1,
    })
    const der = AsnConvert.serialize(ecParams);
    assert.strictEqual(Buffer.from(der).toString("hex"), ecParamsHex);
  });

  it("parse", () => {
    const ecParams = AsnConvert.parse(Buffer.from(ecParamsHex, "hex"), ECParameters);
    assert.strictEqual(ecParams.namedCurve, id_secp256r1);
  });

});
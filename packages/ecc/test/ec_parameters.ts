import * as assert from "assert";
import { ECParameters, id_secp256r1 } from "../src";
import { AsnConvert } from "@peculiar/asn1-schema";

context("EC parameters", () => {

  context("Named curve", () => {

    const ecParamsHex = "06082a8648ce3d030107";

    it("serialize", () => {
      const ecParams = new ECParameters({
        namedCurve: id_secp256r1,
      });
      const der = AsnConvert.serialize(ecParams);
      assert.strictEqual(Buffer.from(der).toString("hex"), ecParamsHex);
    });

    it("parse", () => {
      const ecParams = AsnConvert.parse(Buffer.from(ecParamsHex, "hex"), ECParameters);
      assert.strictEqual(ecParams.namedCurve, id_secp256r1);
    });

  });

  context("Specified curve", () => {
    // Reference: https://github.com/PeculiarVentures/asn1-schema/issues/102

    const ecParamsEnc = Buffer.from("MIH3AgEBMCwGByqGSM49AQECIQD_____AAAAAQAAAAAAAAAAAAAAAP_______________zBbBCD_____AAAAAQAAAAAAAAAAAAAAAP_______________AQgWsY12Ko6k-ez671VdpiGvGUdBrDMU7D2O848PifSYEsDFQDEnTYIhucEk2pmeOETnSa3gZ9-kARBBGsX0fLhLEJH-Lzm5WOkQPJ3A32BLeszoPShOUXYmMKWT-NC4v4af5uO5-tKfA-eFivOM1drMV7Oy7ZAaDe_UfUCIQD_____AAAAAP__________vOb6racXnoTzucrC_GMlUQIBAQ", "base64url");

    it("parse/serialize", () => {
      const ecParams = AsnConvert.parse(ecParamsEnc, ECParameters);
      assert.ok(ecParams.specifiedCurve);
      const specifiedCurve = ecParams.specifiedCurve;

      // Check version
      assert.strictEqual(specifiedCurve.version, 1);

      // Check fieldID
      const fieldID = specifiedCurve.fieldID;
      assert.strictEqual(fieldID.fieldType, '1.2.840.10045.1.1');
      assert.strictEqual(fieldID.parameters.byteLength, 35);

      // Check curve
      const curve = specifiedCurve.curve;
      assert.strictEqual(curve.a.byteLength, 32);
      assert.strictEqual(curve.b.byteLength, 32);
      assert.strictEqual(curve.seed!.byteLength, 20);

      // Check base
      assert.strictEqual(specifiedCurve.base.byteLength, 65);

      // Check order
      assert.strictEqual(specifiedCurve.order.byteLength, 33);

      // Check cofactor
      assert.strictEqual(specifiedCurve.cofactor, 1);

      // Serialize and compare
      const der = AsnConvert.serialize(ecParams);
      assert.strictEqual(Buffer.from(der).compare(ecParamsEnc), 0, "Encoded EC parameters are not equal");
    });
  });

});
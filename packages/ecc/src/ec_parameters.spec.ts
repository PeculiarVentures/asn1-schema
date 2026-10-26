import { describe, expect, it } from "vitest";
import { AsnConvert } from "@peculiar/asn1-schema";
import { ECParameters, id_secp256r1 } from "./index";

describe("EC parameters", () => {
  describe("Named curve", () => {
    const ecParamsHex = "06082a8648ce3d030107";

    it("serialize", () => {
      const ecParams = new ECParameters({ namedCurve: id_secp256r1 });
      const der = AsnConvert.serialize(ecParams);
      expect(Buffer.from(der).toString("hex")).toBe(ecParamsHex);
    });

    it("parse", () => {
      const ecParams = AsnConvert.parse(Buffer.from(ecParamsHex, "hex"), ECParameters);
      expect(ecParams.namedCurve).toBe(id_secp256r1);
    });
  });

  describe("Specified curve", () => {
    // Reference: https://github.com/PeculiarVentures/asn1-schema/issues/102

    const ecParamsEnc = Buffer.from(
      "MIH3AgEBMCwGByqGSM49AQECIQD_____AAAAAQAAAAAAAAAAAAAAAP_______________zBbBCD_____AAAAAQAAAAAAAAAAAAAAAP_______________AQgWsY12Ko6k-ez671VdpiGvGUdBrDMU7D2O848PifSYEsDFQDEnTYIhucEk2pmeOETnSa3gZ9-kARBBGsX0fLhLEJH-Lzm5WOkQPJ3A32BLeszoPShOUXYmMKWT-NC4v4af5uO5-tKfA-eFivOM1drMV7Oy7ZAaDe_UfUCIQD_____AAAAAP__________vOb6racXnoTzucrC_GMlUQIBAQ",
      "base64url",
    );

    it("parse/serialize", () => {
      const ecParams = AsnConvert.parse(ecParamsEnc, ECParameters);
      expect(ecParams.specifiedCurve).toBeTruthy();
      const specifiedCurve = ecParams.specifiedCurve;

      // Check version
      expect(specifiedCurve!.version).toBe(1);

      // Check fieldID
      const fieldID = specifiedCurve!.fieldID;
      expect(fieldID.fieldType).toBe("1.2.840.10045.1.1");
      expect(fieldID.parameters.byteLength).toBe(35);

      // Check curve
      const curve = specifiedCurve!.curve;
      expect(curve.a.byteLength).toBe(32);
      expect(curve.b.byteLength).toBe(32);
      expect(curve.seed!.byteLength).toBe(20);

      // Check base
      expect(specifiedCurve!.base.byteLength).toBe(65);

      // Check order
      expect(specifiedCurve!.order.byteLength).toBe(33);

      // Check cofactor
      expect(specifiedCurve!.cofactor).toBe(1);

      // Serialize and compare
      const der = AsnConvert.serialize(ecParams);
      expect(Buffer.from(der).compare(ecParamsEnc), "Encoded EC parameters are not equal").toBe(0);
    });
  });
});

import * as assert from "assert";
import { AsnConvert, OctetString } from "@peculiar/asn1-schema";
import * as android from "@peculiar/asn1-android";

context("Android", () => {

  context("KeyDescription", () => {

    it("parse", () => {
      // https://github.com/PeculiarVentures/asn1-schema/issues/23#issuecomment-656408096
      const hex = "3081cf0201020a01000201010a010004209f54497cde948349eae4f48de970808d4ddcdce4ddeee23b76d5c5ddcc1b898e04003069bf853d080206015ed3e3cfa0bf85455904573055312f302d0428636f6d2e616e64726f69642e6b657973746f72652e616e64726f69646b657973746f726564656d6f0201013122042074cfcb507488f529108591c7a505919f327732fbc1d803526aea980006d2d8983032a1053103020102a203020103a30402020100a5053103020104aa03020101bf837803020102bf853e03020100bf853f020500";

      const kd = AsnConvert.parse(Buffer.from(hex, "hex"), android.KeyDescription);

      assert.strictEqual(kd.attestationVersion, android.Version.KM3);
      assert.strictEqual(kd.attestationSecurityLevel, android.SecurityLevel.software);
      assert.strictEqual(kd.keymasterVersion, 1);
      assert.strictEqual(kd.keymasterSecurityLevel, android.SecurityLevel.software);
      assert.strictEqual(kd.attestationChallenge.byteLength, 32);
      assert.strictEqual(kd.uniqueId.byteLength, 0);
      assert.strictEqual(kd.softwareEnforced.creationDateTime, "1506793476000");
      assert.ok(kd.softwareEnforced.attestationApplicationId);
      assert.strictEqual(kd.softwareEnforced.attestationApplicationId.byteLength, 87);
      assert.ok(kd.teeEnforced.purpose);
      assert.strictEqual(kd.teeEnforced.purpose.length, 1);
      assert.strictEqual(kd.teeEnforced.purpose[0], 2);
      assert.strictEqual(kd.teeEnforced.algorithm, 3);
      assert.strictEqual(kd.teeEnforced.keySize, 256);
      assert.ok(kd.teeEnforced.digest);
      assert.strictEqual(kd.teeEnforced.digest.length, 1);
      assert.strictEqual(kd.teeEnforced.digest[0], 4);
      assert.strictEqual(kd.teeEnforced.ecCurve, 1);
      assert.strictEqual(kd.teeEnforced.userAuthType, 2);
      assert.strictEqual(kd.teeEnforced.origin, 0);
      assert.strictEqual(kd.teeEnforced.rollbackResistant, null);
    });

  });

  context("NonStandardKeyDescription", () => {
    it("parse", () => {
      const hex = "308201820201640A01010201640A01010420316231616461333561633432366562316638343563383765653239663065633304003057BF8545530451304F312930270421636F6D2E7469636B7069636B6C6C632E63656F627269656E2E7469636B7069636B0202012931220420CE016851B704DA76FDEDDE34AB314A155CA5A5DB31266D2685FCBF281AB510283081F6A1083106020103020102A203020103A30402020100A5053103020104AA03020101BF8377020500BF853E03020100BF85404C304A04209FB52F0954613F221AF4F4070C31415ED44C1A81D51889DB0946632599B3E9460101FF0A01000420FFAEEC3477824DD82E09B6400602DCB274EB4E89DCB6093AD1F6EDE964ED73C3BF854105020301D4C0BF8542050203031644BF854D1604146D6F746F726F6C61206564676520283230323229BF854C0A04086D6F746F726F6C61BF85480D040B7465736C615F675F737973BF85470704057465736C61BF85460A04086D6F746F726F6C61BF854E0602040134B291BF854F0602040134B291";

      const kd = AsnConvert.parse(Buffer.from(hex, "hex"), android.NonStandardKeyDescription);
      assert.strictEqual(kd.attestationVersion, 100);
      assert.strictEqual(kd.attestationSecurityLevel, android.SecurityLevel.trustedEnvironment);
      assert.strictEqual(kd.keymasterVersion, 100);
      assert.strictEqual(kd.keymasterSecurityLevel, android.SecurityLevel.trustedEnvironment);
      assert.strictEqual(kd.attestationChallenge.byteLength, 32);
      assert.strictEqual(kd.uniqueId.byteLength, 0);
      assert.strictEqual(kd.softwareEnforced.findProperty("attestationApplicationId")?.byteLength, 81);
      assert.strictEqual(kd.teeEnforced.findProperty("attestationIdBrand")?.byteLength, 8);
    });

    it("should create standard KeyDescription and parse using NonStandardKeyDescription", () => {
      const attestation = new android.AttestationApplicationId({
        packageInfos: [
          new android.AttestationPackageInfo({
            packageName: new OctetString(Buffer.from("123", "utf8")),
            version: 1,
          }),
        ],
        signatureDigests: [
          new OctetString(Buffer.from("123", "utf8")),
        ],
      });
      const kd = new android.KeyDescription({
        attestationVersion: android.Version.keyMint2,
        attestationSecurityLevel: android.SecurityLevel.software,
        keymasterVersion: 1,
        keymasterSecurityLevel: android.SecurityLevel.software,
        attestationChallenge: new OctetString(Buffer.from("123", "utf8")),
        uniqueId: new OctetString(Buffer.from("123", "utf8")),
        softwareEnforced: new android.AuthorizationList({
          creationDateTime: 1506793476000,
          attestationApplicationId: new OctetString(AsnConvert.serialize(attestation)),
        }),
        teeEnforced: new android.AuthorizationList({
          purpose: new android.IntegerSet([1]),
          algorithm: 1,
          keySize: 1,
          digest: new android.IntegerSet([1]),
          ecCurve: 1,
          userAuthType: 1,
          origin: 1,
          rollbackResistant: null,
        }),
      });

      const raw = AsnConvert.serialize(kd);
      const kd2 = AsnConvert.parse(raw, android.NonStandardKeyDescription);

      assert.strictEqual(kd2.attestationVersion, 200);
    });
  });

  context("AttestationApplicationId", () => {
    it("serialize/parse", () => {
      const attestation = new android.AttestationApplicationId({
        packageInfos: [
          new android.AttestationPackageInfo({
            packageName: new OctetString(Buffer.from("123", "utf8")),
            version: 1,
          }),
        ],
        signatureDigests: [
          new OctetString(Buffer.from("123", "utf8")),
        ],
      });
      const raw = AsnConvert.serialize(attestation);

      const attestation2 = AsnConvert.parse(raw, android.AttestationApplicationId);
      assert.strictEqual(attestation2.packageInfos.length, 1);
      assert.strictEqual(attestation2.packageInfos[0].packageName.byteLength, 3);
      assert.strictEqual(attestation2.packageInfos[0].version, 1);
      assert.strictEqual(attestation2.signatureDigests.length, 1);
      assert.strictEqual(attestation2.signatureDigests[0].byteLength, 3);
    });
  });

});

import { describe, it, assert } from "vitest";
import { AsnConvert, OctetString } from "@peculiar/asn1-schema";
import * as android from "@peculiar/asn1-android";
import { Convert } from "pvtsutils";

describe("Android", () => {
  describe("KeyDescription", () => {
    it("parse", () => {
      // https://github.com/PeculiarVentures/asn1-schema/issues/23#issuecomment-656408096
      const hex =
        "3081cf0201020a01000201010a010004209f54497cde948349eae4f48de970808d4ddcdce4ddeee23b76d5c5ddcc1b898e04003069bf853d080206015ed3e3cfa0bf85455904573055312f302d0428636f6d2e616e64726f69642e6b657973746f72652e616e64726f69646b657973746f726564656d6f0201013122042074cfcb507488f529108591c7a505919f327732fbc1d803526aea980006d2d8983032a1053103020102a203020103a30402020100a5053103020104aa03020101bf837803020102bf853e03020100bf853f020500";

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

  describe("NonStandardKeyDescription", () => {
    it("parse", () => {
      const hex =
        "308201820201640A01010201640A01010420316231616461333561633432366562316638343563383765653239663065633304003057BF8545530451304F312930270421636F6D2E7469636B7069636B6C6C632E63656F627269656E2E7469636B7069636B0202012931220420CE016851B704DA76FDEDDE34AB314A155CA5A5DB31266D2685FCBF281AB510283081F6A1083106020103020102A203020103A30402020100A5053103020104AA03020101BF8377020500BF853E03020100BF85404C304A04209FB52F0954613F221AF4F4070C31415ED44C1A81D51889DB0946632599B3E9460101FF0A01000420FFAEEC3477824DD82E09B6400602DCB274EB4E89DCB6093AD1F6EDE964ED73C3BF854105020301D4C0BF8542050203031644BF854D1604146D6F746F726F6C61206564676520283230323229BF854C0A04086D6F746F726F6C61BF85480D040B7465736C615F675F737973BF85470704057465736C61BF85460A04086D6F746F726F6C61BF854E0602040134B291BF854F0602040134B291";

      const kd = AsnConvert.parse(Buffer.from(hex, "hex"), android.NonStandardKeyDescription);
      assert.strictEqual(kd.attestationVersion, 100);
      assert.strictEqual(kd.attestationSecurityLevel, android.SecurityLevel.trustedEnvironment);
      assert.strictEqual(kd.keymasterVersion, 100);
      assert.strictEqual(kd.keymasterSecurityLevel, android.SecurityLevel.trustedEnvironment);
      assert.strictEqual(kd.attestationChallenge.byteLength, 32);
      assert.strictEqual(kd.uniqueId.byteLength, 0);
      assert.strictEqual(
        kd.softwareEnforced.findProperty("attestationApplicationId")?.byteLength,
        81,
      );
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
        signatureDigests: [new OctetString(Buffer.from("123", "utf8"))],
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

  describe("AttestationApplicationId", () => {
    it("serialize/parse", () => {
      const attestation = new android.AttestationApplicationId({
        packageInfos: [
          new android.AttestationPackageInfo({
            packageName: new OctetString(Buffer.from("123", "utf8")),
            version: 1,
          }),
        ],
        signatureDigests: [new OctetString(Buffer.from("123", "utf8"))],
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

  // https://github.com/PeculiarVentures/asn1-schema/issues/107
  describe("KeyMint v300 and v400", () => {
    it("should create and serialize KeyMintKeyDescription for v300", () => {
      const attestation = new android.AttestationApplicationId({
        packageInfos: [
          new android.AttestationPackageInfo({
            packageName: new OctetString(Buffer.from("com.example.app", "utf8")),
            version: 1,
          }),
        ],
        signatureDigests: [new OctetString(Buffer.from("0123456789abcdef", "hex"))],
      });

      const keyMintDesc = new android.KeyMintKeyDescription({
        attestationVersion: android.Version.keyMint3,
        attestationSecurityLevel: android.SecurityLevel.software,
        keyMintVersion: 1,
        keyMintSecurityLevel: android.SecurityLevel.trustedEnvironment,
        attestationChallenge: new OctetString(Buffer.from("challenge-data", "utf8")),
        uniqueId: new OctetString(Buffer.from("unique-id-data", "utf8")),
        softwareEnforced: new android.AuthorizationList({
          creationDateTime: 1684321765000, // May 17, 2023
          attestationApplicationId: new OctetString(AsnConvert.serialize(attestation)),
        }),
        hardwareEnforced: new android.AuthorizationList({
          purpose: new android.IntegerSet([1, 2]),
          algorithm: 3, // EC
          keySize: 256,
          digest: new android.IntegerSet([4]), // SHA-256
          ecCurve: 1, // P-256
          userAuthType: 2,
          origin: 1,
          attestationIdSecondImei: new OctetString(Buffer.from("second-imei", "utf8")),
          rootOfTrust: new android.RootOfTrust({
            verifiedBootKey: new OctetString(Buffer.from("boot-key-data", "utf8")),
            deviceLocked: true,
            verifiedBootState: android.VerifiedBootState.verified,
            verifiedBootHash: new OctetString(Buffer.from("boot-hash-data", "utf8")),
          }),
        }),
      });

      const raw = AsnConvert.serialize(keyMintDesc);
      assert.ok(raw);
      assert.ok(raw.byteLength > 0);

      // Verify we can parse it back
      const parsed = AsnConvert.parse(raw, android.KeyMintKeyDescription);
      assert.strictEqual(parsed.attestationVersion, android.Version.keyMint3);
      assert.strictEqual(parsed.keyMintVersion, 1);
      assert.strictEqual(parsed.keyMintSecurityLevel, android.SecurityLevel.trustedEnvironment);
      assert.ok(parsed.hardwareEnforced.attestationIdSecondImei);
      assert.strictEqual(
        Convert.ToUtf8String(parsed.hardwareEnforced.attestationIdSecondImei),
        "second-imei",
      );

      // Check RootOfTrust's verifiedBootHash
      assert.ok(parsed.hardwareEnforced.rootOfTrust);
      assert.ok(parsed.hardwareEnforced.rootOfTrust.verifiedBootHash);
      assert.strictEqual(
        Convert.ToUtf8String(parsed.hardwareEnforced.rootOfTrust.verifiedBootHash),
        "boot-hash-data",
      );

      // Test conversion to legacy format
      const legacy = parsed.toLegacyKeyDescription();
      assert.strictEqual(legacy.keymasterVersion, parsed.keyMintVersion);
      assert.strictEqual(legacy.teeEnforced, parsed.hardwareEnforced);
    });

    it("should parse v300 with NonStandardKeyMintKeyDescription", () => {
      const keyMintDesc = new android.KeyMintKeyDescription({
        attestationVersion: android.Version.keyMint3,
        attestationSecurityLevel: android.SecurityLevel.software,
        keyMintVersion: 1,
        keyMintSecurityLevel: android.SecurityLevel.trustedEnvironment,
        attestationChallenge: new OctetString(Buffer.from("challenge-data", "utf8")),
        uniqueId: new OctetString(Buffer.from("unique-id-data", "utf8")),
        softwareEnforced: new android.AuthorizationList({
          creationDateTime: 1684321765000,
        }),
        hardwareEnforced: new android.AuthorizationList({
          purpose: new android.IntegerSet([1, 2]),
          algorithm: 3,
          attestationIdSecondImei: new OctetString(Buffer.from("second-imei", "utf8")),
        }),
      });

      const raw = AsnConvert.serialize(keyMintDesc);

      // Parse with non-standard parser
      const parsed = AsnConvert.parse(raw, android.NonStandardKeyMintKeyDescription);

      // Verify fields
      assert.strictEqual(parsed.attestationVersion, android.Version.keyMint3);
      assert.strictEqual(parsed.keyMintVersion, 1);
      assert.strictEqual(parsed.keyMintSecurityLevel, android.SecurityLevel.trustedEnvironment);

      // Check fields using the findProperty method
      const secondImei = parsed.hardwareEnforced.findProperty("attestationIdSecondImei");
      assert.ok(secondImei);
      assert.strictEqual(Convert.ToUtf8String(secondImei), "second-imei");
    });

    it("should create and serialize KeyMintKeyDescription", () => {
      const attestation = new android.AttestationApplicationId({
        packageInfos: [
          new android.AttestationPackageInfo({
            packageName: new OctetString(Buffer.from("com.example.app", "utf8")),
            version: 1,
          }),
        ],
        signatureDigests: [new OctetString(Buffer.from("0123456789abcdef", "hex"))],
      });

      const keyMintDesc = new android.KeyMintKeyDescription({
        attestationVersion: android.Version.keyMint4,
        attestationSecurityLevel: android.SecurityLevel.software,
        keyMintVersion: 1,
        keyMintSecurityLevel: android.SecurityLevel.trustedEnvironment,
        attestationChallenge: new OctetString(Buffer.from("challenge-data", "utf8")),
        uniqueId: new OctetString(Buffer.from("unique-id-data", "utf8")),
        softwareEnforced: new android.AuthorizationList({
          creationDateTime: 1684321765000, // May 17, 2023
          attestationApplicationId: new OctetString(AsnConvert.serialize(attestation)),
        }),
        hardwareEnforced: new android.AuthorizationList({
          purpose: new android.IntegerSet([1, 2]),
          algorithm: 3, // EC
          keySize: 256,
          digest: new android.IntegerSet([4]), // SHA-256
          ecCurve: 1, // P-256
          userAuthType: 2,
          origin: 1,
          attestationIdSecondImei: new OctetString(Buffer.from("second-imei", "utf8")),
          moduleHash: new OctetString(Buffer.from("module-hash-value", "utf8")),
          rootOfTrust: new android.RootOfTrust({
            verifiedBootKey: new OctetString(Buffer.from("boot-key-data", "utf8")),
            deviceLocked: true,
            verifiedBootState: android.VerifiedBootState.verified,
            verifiedBootHash: new OctetString(Buffer.from("boot-hash-data", "utf8")), // Required in v400
          }),
        }),
      });

      const raw = AsnConvert.serialize(keyMintDesc);
      assert.ok(raw);
      assert.ok(raw.byteLength > 0);

      // Verify we can parse it back
      const parsed = AsnConvert.parse(raw, android.KeyMintKeyDescription);
      assert.strictEqual(parsed.attestationVersion, android.Version.keyMint4);
      assert.strictEqual(parsed.keyMintVersion, 1);
      assert.strictEqual(parsed.keyMintSecurityLevel, android.SecurityLevel.trustedEnvironment);
      assert.ok(parsed.hardwareEnforced.moduleHash);
      assert.strictEqual(
        Convert.ToUtf8String(parsed.hardwareEnforced.moduleHash),
        "module-hash-value",
      );
      assert.ok(parsed.hardwareEnforced.attestationIdSecondImei);
      assert.strictEqual(
        Convert.ToUtf8String(parsed.hardwareEnforced.attestationIdSecondImei),
        "second-imei",
      );

      // Check RootOfTrust's verifiedBootHash
      assert.ok(parsed.hardwareEnforced.rootOfTrust);
      assert.ok(parsed.hardwareEnforced.rootOfTrust.verifiedBootHash);
      assert.strictEqual(
        Convert.ToUtf8String(parsed.hardwareEnforced.rootOfTrust.verifiedBootHash),
        "boot-hash-data",
      );
    });

    it("should parse v400 with NonStandardKeyMintKeyDescription", () => {
      const keyMintDesc = new android.KeyMintKeyDescription({
        attestationVersion: android.Version.keyMint4,
        attestationSecurityLevel: android.SecurityLevel.software,
        keyMintVersion: 1,
        keyMintSecurityLevel: android.SecurityLevel.trustedEnvironment,
        attestationChallenge: new OctetString(Buffer.from("challenge-data", "utf8")),
        uniqueId: new OctetString(Buffer.from("unique-id-data", "utf8")),
        softwareEnforced: new android.AuthorizationList({
          creationDateTime: 1684321765000,
        }),
        hardwareEnforced: new android.AuthorizationList({
          purpose: new android.IntegerSet([1, 2]),
          algorithm: 3,
          attestationIdSecondImei: new OctetString(Buffer.from("second-imei", "utf8")),
          moduleHash: new OctetString(Buffer.from("module-hash-value", "utf8")),
        }),
      });

      const raw = AsnConvert.serialize(keyMintDesc);

      // Parse with non-standard parser
      const parsed = AsnConvert.parse(raw, android.NonStandardKeyMintKeyDescription);

      // Verify fields
      assert.strictEqual(parsed.attestationVersion, android.Version.keyMint4);
      assert.strictEqual(parsed.keyMintVersion, 1);
      assert.strictEqual(parsed.keyMintSecurityLevel, android.SecurityLevel.trustedEnvironment);

      // Check the new fields using the findProperty method
      const moduleHash = parsed.hardwareEnforced.findProperty("moduleHash");
      assert.ok(moduleHash);
      assert.strictEqual(Convert.ToUtf8String(moduleHash), "module-hash-value");

      const secondImei = parsed.hardwareEnforced.findProperty("attestationIdSecondImei");
      assert.ok(secondImei);
      assert.strictEqual(Convert.ToUtf8String(secondImei), "second-imei");
    });

    it("should convert between KeyDescription and KeyMintKeyDescription", () => {
      // Create a legacy KeyDescription
      const legacy = new android.KeyDescription({
        attestationVersion: android.Version.KM4,
        attestationSecurityLevel: android.SecurityLevel.software,
        keymasterVersion: 1,
        keymasterSecurityLevel: android.SecurityLevel.trustedEnvironment,
        attestationChallenge: new OctetString(Buffer.from("challenge", "utf8")),
        uniqueId: new OctetString(Buffer.from("uniqueid", "utf8")),
        softwareEnforced: new android.AuthorizationList({
          creationDateTime: 1506793476000,
        }),
        teeEnforced: new android.AuthorizationList({
          purpose: new android.IntegerSet([1, 2]),
          algorithm: 1,
          keySize: 2048,
        }),
      });

      // Convert to KeyMintKeyDescription
      const keyMint = android.KeyMintKeyDescription.fromLegacyKeyDescription(legacy);

      // Verify conversion
      assert.strictEqual(keyMint.attestationVersion, legacy.attestationVersion);
      assert.strictEqual(keyMint.keyMintVersion, legacy.keymasterVersion);
      assert.strictEqual(keyMint.keyMintSecurityLevel, legacy.keymasterSecurityLevel);
      assert.deepStrictEqual(keyMint.hardwareEnforced, legacy.teeEnforced);

      // Convert back to legacy
      const convertedBack = keyMint.toLegacyKeyDescription();

      // Verify conversion back
      assert.strictEqual(convertedBack.attestationVersion, legacy.attestationVersion);
      assert.strictEqual(convertedBack.keymasterVersion, legacy.keymasterVersion);
      assert.strictEqual(convertedBack.keymasterSecurityLevel, legacy.keymasterSecurityLevel);
      assert.deepStrictEqual(convertedBack.teeEnforced, legacy.teeEnforced);
    });

    it("should access v400 fields via original NonStandardKeyDescription", () => {
      // Create KeyMintKeyDescription
      const keyMintDesc = new android.KeyMintKeyDescription({
        attestationVersion: android.Version.keyMint4,
        keyMintVersion: 1,
        keyMintSecurityLevel: android.SecurityLevel.trustedEnvironment,
        hardwareEnforced: new android.AuthorizationList({
          moduleHash: new OctetString(Buffer.from("module-hash", "utf8")),
          attestationIdSecondImei: new OctetString(Buffer.from("second-imei", "utf8")),
        }),
      });

      const raw = AsnConvert.serialize(keyMintDesc);

      // Parse with original NonStandardKeyDescription
      const parsed = AsnConvert.parse(raw, android.NonStandardKeyDescription);

      // Should access v400 fields via accessors
      assert.strictEqual(parsed.keyMintVersion, 1);
      assert.strictEqual(parsed.keyMintSecurityLevel, android.SecurityLevel.trustedEnvironment);

      // Check module hash and second IMEI with hardwareEnforced getter
      const moduleHash = parsed.hardwareEnforced.findProperty("moduleHash");
      assert.ok(moduleHash);
      assert.strictEqual(Convert.ToUtf8String(moduleHash), "module-hash");

      const secondImei = parsed.hardwareEnforced.findProperty("attestationIdSecondImei");
      assert.ok(secondImei);
      assert.strictEqual(Convert.ToUtf8String(secondImei), "second-imei");
    });
  });
});

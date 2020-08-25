import * as assert from "assert";
import { AsnConvert } from "@peculiar/asn1-schema";
import { KeyDescription, Version, SecurityLevel } from "../src/key_description";

context("Android", () => {

  context("KeyDescription", () => {

    it("parse", () => {
      // https://github.com/PeculiarVentures/asn1-schema/issues/23#issuecomment-656408096
      const hex = "3081cf0201020a01000201010a010004209f54497cde948349eae4f48de970808d4ddcdce4ddeee23b76d5c5ddcc1b898e04003069bf853d080206015ed3e3cfa0bf85455904573055312f302d0428636f6d2e616e64726f69642e6b657973746f72652e616e64726f69646b657973746f726564656d6f0201013122042074cfcb507488f529108591c7a505919f327732fbc1d803526aea980006d2d8983032a1053103020102a203020103a30402020100a5053103020104aa03020101bf837803020102bf853e03020100bf853f020500";

      const kd = AsnConvert.parse(Buffer.from(hex, "hex"), KeyDescription);

      assert.strictEqual(kd.attestationVersion, Version.KM3);
      assert.strictEqual(kd.attestationSecurityLevel, SecurityLevel.software);
      assert.strictEqual(kd.keymasterVersion, 1);
      assert.strictEqual(kd.keymasterSecurityLevel, SecurityLevel.software);
      assert.strictEqual(kd.attestationChallenge.byteLength, 32);
      assert.strictEqual(kd.uniqueId.byteLength, 0);
      assert.strictEqual(kd.softwareEnforced.creationDateTime, '1506793476000');
      assert.strictEqual(kd.softwareEnforced.attestationApplicationId!.byteLength, 87);
      assert.strictEqual(kd.teeEnforced.purpose!.length, 1);
      assert.strictEqual(kd.teeEnforced.purpose![0], 2);
      assert.strictEqual(kd.teeEnforced.algorithm, 3);
      assert.strictEqual(kd.teeEnforced.keySize, 256);
      assert.strictEqual(kd.teeEnforced.digest!.length, 1);
      assert.strictEqual(kd.teeEnforced.digest![0], 4);
      assert.strictEqual(kd.teeEnforced.ecCurve, 1);
      assert.strictEqual(kd.teeEnforced.userAuthType, 2);
      assert.strictEqual(kd.teeEnforced.origin, 0);
      assert.strictEqual(kd.teeEnforced.rollbackResistant, null);
    });

  });

});

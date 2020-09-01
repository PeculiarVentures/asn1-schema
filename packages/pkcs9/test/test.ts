import { AsnConvert } from "@peculiar/asn1-schema";
import { Attribute, id_ce_subjectAltName, id_ce_subjectKeyIdentifier } from "@peculiar/asn1-x509";
import * as assert from "assert";
import { Convert } from "pvtsutils";
import { ExtensionRequest, id_pkcs9_at_extensionRequest } from "../src";

context("PKCS#9", () => {

  it("ExtensionRequest", () => {
    const hex = "303a06092a864886f70d01090e312d302b30290603551d0e04220420da80914ab1c14b4113d5939781fbdc4632793f7794f5a1c96bacf261040f1654";

    const attr = AsnConvert.parse(Convert.FromHex(hex), Attribute);
    assert.strictEqual(attr.type, id_pkcs9_at_extensionRequest);
    assert.strictEqual(attr.values.length, 1);

    const extensionRequest = AsnConvert.parse(attr.values[0], ExtensionRequest)
    assert.strictEqual(extensionRequest.length, 1);
    assert.strictEqual(extensionRequest[0].extnID, id_ce_subjectKeyIdentifier);
  });

});
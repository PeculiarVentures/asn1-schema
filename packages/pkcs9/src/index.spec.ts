import { describe, expect, it } from "vitest";
import { AsnConvert } from "@peculiar/asn1-schema";
import { Attribute, id_ce_subjectKeyIdentifier } from "@peculiar/asn1-x509";
import { hex } from "@peculiar/utils/encoding";
import { ExtensionRequest, id_pkcs9_at_extensionRequest } from "./index";

describe("PKCS#9", () => {
  it("ExtensionRequest", () => {
    const hexString = "303a06092a864886f70d01090e312d302b30290603551d0e04220420da80914ab1c14b4113d5939781fbdc4632793f7794f5a1c96bacf261040f1654";

    const attr = AsnConvert.parse(hex.decode(hexString), Attribute);
    expect(attr.type).toBe(id_pkcs9_at_extensionRequest);
    expect(attr.values.length).toBe(1);

    const extensionRequest = AsnConvert.parse(attr.values[0], ExtensionRequest);
    expect(extensionRequest.length).toBe(1);
    expect(extensionRequest[0].extnID).toBe(id_ce_subjectKeyIdentifier);
  });
});

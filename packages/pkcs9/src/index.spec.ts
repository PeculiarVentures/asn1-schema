import { describe, expect, it } from "vitest";
import { id_aes128_CBC, id_aes192_CBC, id_aes256_CBC } from "@peculiar/asn1-cms";
import { AsnConvert } from "@peculiar/asn1-schema";
import { Attribute, id_ce_subjectKeyIdentifier } from "@peculiar/asn1-x509";
import { hex } from "@peculiar/utils/encoding";
import { ExtensionRequest, id_pkcs9_at_extensionRequest, SMIMECapabilities, SMIMECapability } from "./index";

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

  it("round-trips AES-CBC SMIMECapabilities with absent parameters (RFC 3565 section 5.1)", () => {
    // Capabilities advertise algorithms in preference order, without the IV used for content encryption.
    const algorithms = [id_aes256_CBC, id_aes192_CBC, id_aes128_CBC];
    const capabilities = new SMIMECapabilities(algorithms.map((algorithm) => new SMIMECapability({ algorithm })));
    const der = AsnConvert.serialize(capabilities);

    // RFC 3565 section 5.1 gives these OID-only capability encodings for all three key sizes.
    const expectedDer = "3027300b060960864801650304012a300b0609608648016503040116300b0609608648016503040102";
    expect(Buffer.from(der).toString("hex")).toBe(expectedDer);

    const parsed = AsnConvert.parse(der, SMIMECapabilities);
    expect(parsed).toHaveLength(3);
    parsed.forEach((capability, index) => {
      expect(capability).toBeInstanceOf(SMIMECapability);
      expect(capability.algorithm).toBe(algorithms[index]);
      expect(capability.parameters).toBeUndefined();
    });
    expect(AsnConvert.serialize(parsed)).toEqual(der);
  });
});

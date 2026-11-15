import { describe, expect, it } from "vitest";
import { AsnConvert, OctetString } from "@peculiar/asn1-schema";
import { AlgorithmIdentifier } from "@peculiar/asn1-x509";
import { id_aes, id_aes128_CBC, id_aes192_CBC, id_aes256_CBC, id_aes128_wrap, id_aes192_wrap, id_aes256_wrap } from "./index";

describe("CMS AES algorithms (RFC 3565)", () => {
  it("exports the AES arc and algorithm OIDs", () => {
    expect(id_aes).toBe("2.16.840.1.101.3.4.1");
    expect(id_aes128_CBC).toBe("2.16.840.1.101.3.4.1.2");
    expect(id_aes192_CBC).toBe("2.16.840.1.101.3.4.1.22");
    expect(id_aes256_CBC).toBe("2.16.840.1.101.3.4.1.42");
    expect(id_aes128_wrap).toBe("2.16.840.1.101.3.4.1.5");
    expect(id_aes192_wrap).toBe("2.16.840.1.101.3.4.1.25");
    expect(id_aes256_wrap).toBe("2.16.840.1.101.3.4.1.45");
  });

  it.each([
    [id_aes128_CBC, "02"],
    [id_aes192_CBC, "16"],
    [id_aes256_CBC, "2a"],
  ])("round-trips %s with a 16-byte OCTET STRING IV", (algorithm, oidSuffix) => {
    const iv = new OctetString([0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15]);
    const identifier = new AlgorithmIdentifier({ algorithm, parameters: AsnConvert.serialize(iv) });
    const der = AsnConvert.serialize(identifier);

    expect(Buffer.from(der).toString("hex")).toBe(`301d06096086480165030401${oidSuffix}0410000102030405060708090a0b0c0d0e0f`);

    const parsed = AsnConvert.parse(der, AlgorithmIdentifier);
    expect(parsed.algorithm).toBe(algorithm);
    expect(parsed.parameters).toBeInstanceOf(ArrayBuffer);
    const parsedIv = AsnConvert.parse(parsed.parameters!, OctetString);
    expect(parsedIv.byteLength).toBe(16);
    expect(parsedIv.buffer).toEqual(iv.buffer);
    expect(AsnConvert.serialize(parsed)).toEqual(der);
  });

  it.each([
    [id_aes128_wrap, "05"],
    [id_aes192_wrap, "19"],
    [id_aes256_wrap, "2d"],
  ])("round-trips %s with absent parameters", (algorithm, oidSuffix) => {
    const identifier = new AlgorithmIdentifier({ algorithm });
    const der = AsnConvert.serialize(identifier);

    expect(Buffer.from(der).toString("hex")).toBe(`300b06096086480165030401${oidSuffix}`);

    const parsed = AsnConvert.parse(der, AlgorithmIdentifier);
    expect(parsed.algorithm).toBe(algorithm);
    expect(parsed.parameters).toBeUndefined();
    expect(AsnConvert.serialize(parsed)).toEqual(der);
  });
});

import { describe, expect, it } from "vitest";
import { AsnConvert } from "@peculiar/asn1-schema";
import { GeneralName, GeneralNames } from "@peculiar/asn1-x509";
import { hex } from "@peculiar/utils/encoding";
import { IssuerSerial } from "./issuer_serial";

describe("IssuerSerial", () => {
  // SEQUENCE { SEQUENCE { [2] "test" }, INTEGER 0x16c2 }
  const withoutUID = "300c3006820474657374020216c2";
  // same, followed by issuerUID BIT STRING (empty)
  const withUID = "300f3006820474657374020216c2030100";

  it("omits issuerUID when it is not set", () => {
    const issuerSerial = new IssuerSerial({
      issuer: new GeneralNames([new GeneralName({ dNSName: "test" })]),
      serial: new Uint8Array([0x16, 0xc2]).buffer,
    });

    expect(hex.encode(AsnConvert.serialize(issuerSerial))).toBe(withoutUID);
  });

  it.each([
    ["without issuerUID", withoutUID],
    ["with issuerUID", withUID],
  ])("round-trips %s", (_, encoded) => {
    const issuerSerial = AsnConvert.parse(hex.decode(encoded), IssuerSerial);

    expect(hex.encode(AsnConvert.serialize(issuerSerial))).toBe(encoded);
  });
});

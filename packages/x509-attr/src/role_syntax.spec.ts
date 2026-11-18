import { describe, expect, it } from "vitest";
import { AsnConvert } from "@peculiar/asn1-schema";
import { GeneralName } from "@peculiar/asn1-x509";
import { hex } from "@peculiar/utils/encoding";
import { RoleSyntax } from "./role_syntax";

describe("RoleSyntax", () => {
  // SEQUENCE { [1] { [6] "urn:oid:1.3.6.1.4.1.99999.1.1" } }
  const encoded = "3021a11f861d75726e3a6f69643a312e332e362e312e342e312e39393939392e312e31";

  it("serializes roleName with an explicit [1] tag", () => {
    const roleSyntax = new RoleSyntax({
      roleName: new GeneralName({ uniformResourceIdentifier: "urn:oid:1.3.6.1.4.1.99999.1.1" }),
    });

    expect(hex.encode(AsnConvert.serialize(roleSyntax))).toBe(encoded);
  });

  it("parses roleName with an explicit [1] tag", () => {
    const roleSyntax = AsnConvert.parse(hex.decode(encoded), RoleSyntax);

    expect(roleSyntax.roleName?.uniformResourceIdentifier).toBe("urn:oid:1.3.6.1.4.1.99999.1.1");
    expect(hex.encode(AsnConvert.serialize(roleSyntax))).toBe(encoded);
  });
});

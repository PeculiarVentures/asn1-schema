import { describe, expect, it } from "vitest";
import { AsnConvert } from "@peculiar/asn1-schema";
import { GeneralName } from "@peculiar/asn1-x509";
import { hex } from "@peculiar/utils/encoding";
import { Target } from "./target";

describe("Target", () => {
  it.each([
    // [0] { [2] "a.b" }
    ["targetName", "a0058203612e62"],
    // [1] { [2] "a.b" }
    ["targetGroup", "a1058203612e62"],
  ] as const)("round-trips %s with an explicit tag", (field, encoded) => {
    const target = new Target({ [field]: new GeneralName({ dNSName: "a.b" }) });
    expect(hex.encode(AsnConvert.serialize(target))).toBe(encoded);

    const parsed = AsnConvert.parse(hex.decode(encoded), Target);
    expect(parsed[field]?.dNSName).toBe("a.b");
  });
});

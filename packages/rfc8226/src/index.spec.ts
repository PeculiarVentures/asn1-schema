import { describe, expect, it } from "vitest";
import { AsnConvert } from "@peculiar/asn1-schema";
import { TNAuthorizationList } from "./index";

describe("RFC8266", () => {
  describe("TNAuthorizationList", () => {
    it("spc", () => {
      const hex = "3008a00616043730394a";

      const ext = AsnConvert.parse(Buffer.from(hex, "hex"), TNAuthorizationList);
      expect(ext.length).toBe(1);
      expect(ext[0].spc).toBe("709J");

      const raw = AsnConvert.serialize(ext);
      expect(Buffer.from(raw).toString("hex")).toBe(hex);
    });
  });
});

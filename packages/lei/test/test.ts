import * as assert from "assert";
import { AsnConvert } from "@peculiar/asn1-schema";
import { LeiChoice, LeiRole } from "../src";

context("lei", () => {

  it("LeiChoice", () => {
    const hex = "0C143530363730304745314732393332355158333633";

    const lei = AsnConvert.parse(Buffer.from(hex, "hex"), LeiChoice);
    assert.strictEqual(lei.text, "506700GE1G29325QX363");
  });

  it("LeiRole", () => {
    const hex = "13074D616E61676572";

    const role = AsnConvert.parse(Buffer.from(hex, "hex"), LeiRole);
    assert.strictEqual(role.text, "Manager");
  });

});

import * as assert from "assert";
import { AsnConvert } from "@peculiar/asn1-schema";
import { LeiChoice } from "../src";

context("lei", () => {

  context("LeiChoice", () => {
    const hex = "0C143530363730304745314732393332355158333633";

    const lei = AsnConvert.parse(Buffer.from(hex, "hex"), LeiChoice);
    assert.strictEqual(lei.text, "506700GE1G29325QX363");
  });

});

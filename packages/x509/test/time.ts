import * as assert from "node:assert";
import { AsnConvert } from "@peculiar/asn1-schema";
import { Time, Validity } from "../src";

describe("Time across DST transitions (issue #182)", () => {
  const originalTZ = process.env.TZ;

  beforeAll(() => {
    // Exercise the repeated local hour even when the test runner starts in UTC.
    process.env.TZ = "Europe/Prague";
    assert.strictEqual(new Date("2026-10-25T00:17:00Z").getTimezoneOffset(), -120);
    assert.strictEqual(new Date("2026-10-25T01:17:00Z").getTimezoneOffset(), -60);
  });

  afterAll(() => {
    if (originalTZ === undefined) {
      delete process.env.TZ;
    } else {
      process.env.TZ = originalTZ;
    }
  });

  const instants = [
    "2026-03-29T00:17:00",
    "2026-03-29T01:17:00",
    "2026-10-25T00:17:00",
    "2026-10-25T01:17:00",
    "2050-03-27T00:17:00",
    "2050-03-27T01:17:00",
    "2050-10-30T00:17:00",
    "2050-10-30T01:17:00",
  ];

  for (const instant of instants) {
    for (const milliseconds of ["000", "173"]) {
      for (const inputType of ["Date", "string", "number"] as const) {
        it(`preserves ${instant}.${milliseconds}Z from ${inputType}`, () => {
          const iso = `${instant}.${milliseconds}Z`;
          const date = new Date(iso);
          const input = inputType === "Date" ? date : inputType === "string" ? iso : date.getTime();
          const time = new Time(input);

          assert.strictEqual(time.getTime().toISOString(), `${instant}.000Z`);
          assert.strictEqual(date.toISOString(), iso);
          if (date.getUTCFullYear() < 2050) {
            assert.strictEqual(time.utcTime, time.getTime());
            assert.strictEqual(time.generalTime, undefined);
          } else {
            assert.strictEqual(time.generalTime, time.getTime());
            assert.strictEqual(time.utcTime, undefined);
          }
        });
      }
    }
  }

  for (const [day, expectedHex] of [
    ["2026-10-25", "301e170d3236313032353030313730305a170d3236313032353031313730305a"],
    ["2050-10-30", "3022180f32303530313033303030313730305a180f32303530313033303031313730305a"],
  ]) {
    it(`serializes and parses Validity across the repeated hour on ${day}`, () => {
      const validity = new Validity({
        notBefore: new Date(`${day}T00:17:00.173Z`),
        notAfter: new Date(`${day}T01:17:00.173Z`),
      });
      const encoded = AsnConvert.serialize(validity);
      assert.strictEqual(Buffer.from(encoded).toString("hex"), expectedHex);

      const decoded = AsnConvert.parse(encoded, Validity);
      assert.strictEqual(decoded.notBefore.getTime().toISOString(), `${day}T00:17:00.000Z`);
      assert.strictEqual(decoded.notAfter.getTime().toISOString(), `${day}T01:17:00.000Z`);
    });
  }
});

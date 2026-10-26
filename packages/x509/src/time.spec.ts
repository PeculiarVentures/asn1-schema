import { afterAll, beforeAll, describe, expect, it } from "vitest";
import { AsnConvert } from "@peculiar/asn1-schema";
import { Time, Validity } from "./index";

describe("Time across DST transitions (issue #182)", () => {
  const originalTZ = process.env.TZ;

  beforeAll(() => {
    // Exercise the repeated local hour even when the test runner starts in UTC.
    process.env.TZ = "Europe/Prague";
    expect(new Date("2026-10-25T00:17:00Z").getTimezoneOffset()).toBe(-120);
    expect(new Date("2026-10-25T01:17:00Z").getTimezoneOffset()).toBe(-60);
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

          expect(time.getTime().toISOString()).toBe(`${instant}.000Z`);
          expect(date.toISOString()).toBe(iso);
          if (date.getUTCFullYear() < 2050) {
            expect(time.utcTime).toBe(time.getTime());
            expect(time.generalTime).toBe(undefined);
          } else {
            expect(time.generalTime).toBe(time.getTime());
            expect(time.utcTime).toBe(undefined);
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
      expect(Buffer.from(encoded).toString("hex")).toBe(expectedHex);

      const decoded = AsnConvert.parse(encoded, Validity);
      expect(decoded.notBefore.getTime().toISOString()).toBe(`${day}T00:17:00.000Z`);
      expect(decoded.notAfter.getTime().toISOString()).toBe(`${day}T01:17:00.000Z`);
    });
  }
});

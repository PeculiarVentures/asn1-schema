import * as assert from "node:assert";
import { AsnParser } from "@peculiar/asn1-schema";
import { Convert } from "pvtsutils";
import {
  DomainName,
  TypeRelationship,
  ActivityDescription,
  WebGDPR,
  InsuranceValue,
  ValuationRanking,
} from "../src";

describe("ntQWAC", () => {
  const id_0_4_0_9496_1 =
    "MIHwMQ8wDQYDVQQDDAZOb3dpbmExGTAXBgNVBAoMEE5vd2luYSBTb2x1dGlvbnMxCzAJBgNVBAYTAkxVMQ8wDQYDVQQHDAZLZWhsZW4xDTALBgNVBBEMBDgyODcxHTAbBgNVBAkMFFpvbmUgaW5kdXN0cmllbGxlIDE1MRkwFwYDVQQUExArMzUyLTY2MS0yMzEtOTE0MR0wGwYJKoZIhvcNAQkBFg5pbmZvQG5vd2luYS5sdTEXMBUGA1UEYQwOVkFUTFUtMjY4NTA2ODIxIzAhBgNVBGEMGkxFSVhHLTIyMjEwMDJRUUo2SzhZUVlRRDA4";
  const id_0_4_0_9496_2 =
    "MGUxEDAOBgNVBCoMB09saXZpZXIxEDAOBgNVBAQMB0JhcmV0dGUxGTAXBgNVBAoMEE5vd2luYSBTb2x1dGlvbnMxCzAJBgNVBAYTAkJFMRcwFQYDVQQFEw5QQVNCRS1BQjEyMzQ1Ng==";
  const id_0_4_0_9496_5 = "MBKgBAMCB4ChBAMCB4CiBAMCB4A=";
  const id_0_4_0_9496_6 =
    "MIICGKAJgQdOQUNFQkVMoQiBBjY2LjAxMKIhDB9Db21wdXRlciBwcm9ncmFtbWluZyBhY3Rpdml0aWVzo4IB3AyCAdhMYSBzb2Npw6l0w6kgYSBwb3VyIG9iamV0IGxlIGTDqXZlbG9wcGVtZW50LCBsYSB2ZW50ZSBldCBsYSBtaXNlIGVuIHBsYWNlIGRlIHNvbHV0aW9ucyBpbmZvcm1hdGlxdWVzIChzb2Z0d2FyZSBldCBoYXJkd2FyZSkgZGVzdGluw6llcyBhdXggZW50cmVwcmlzZXMgcHVibGlxdWVzIGV0IHByaXbDqWVzLCBlbiBjZSBjb21wcmlzIGxhIGNvbnN1bHRhbmNlIGRhbnMgbGUgZG9tYWluZSBpbmZvcm1hdGlxdWUsIGxlIGTDqXZlbG9wcGVtZW50LCBsYSBtaXNlIGVuIHBsYWNlLCBsZSBzdXBwb3J0IGV0IGxhIG1haW50ZW5hbmNlIGRlIHN5c3TDqG1lcyBkJ2luZm9ybWF0aW9uLCBhaW5zaSBxdWUgbGEgdmVudGUgZGUgbWF0w6lyaWVsIGV0IGRlIHByb2dyYW1tZXMsIGFpbnNpIHF1ZSB0b3V0ZXMgbGVzIG9ww6lyYXRpb25zIHNlIHJhcHBvcnRhbnQgZGlyZWN0ZW1lbnQgb3UgaW5kaXJlY3RlbWVudCDDoCBjZXR0ZSBhY3Rpdml0w6ku";
  const id_0_4_0_9496_7 =
    "MIGmoAqBCEdEUFIgQ0FCoRiBFkNlcnRpZmljYXRlIG6wMTI0LzIwMjCiG4YZaHR0cHM6Ly9nZHByY2FiLmx1L25vd2luYaMEEwJMVaRbDFlOb3dpbmEgU29sdXRpb25zIGhhcyBiZWVuIHNob3duIHRvIGJlIEdEUFIgY29tcGxpYW50IGluIGl0cyBzaWduYXR1cmUgY3JlYXRpb24gYWN0aXZpdGllcw==";
  const id_0_4_0_9496_8 = "MAwTA0VVUgICA+gCAQI=";
  const id_0_4_0_9496_9 = "MBACAgH0AgEoAgEeAgECAgEB";

  it("Domain name #1", () => {
    const obj = AsnParser.parse(Convert.FromBase64(id_0_4_0_9496_1), DomainName);

    assert.strictEqual(!!obj, true);
  });

  it("Domain name #2", () => {
    const obj = AsnParser.parse(Convert.FromBase64(id_0_4_0_9496_2), DomainName);

    assert.strictEqual(!!obj, true);
  });

  it("Type Relationship", () => {
    const obj = AsnParser.parse(Convert.FromBase64(id_0_4_0_9496_5), TypeRelationship);

    assert.strictEqual(!!obj, true);
    assert.strictEqual(obj.DNBvsDNO.toNumber(), 1);
    assert.strictEqual(obj.DNBvsDNT.toNumber(), 1);
    assert.strictEqual(obj.DNOvsDNT.toNumber(), 1);
  });

  it("Activity Description", () => {
    const obj = AsnParser.parse(Convert.FromBase64(id_0_4_0_9496_6), ActivityDescription);

    assert.strictEqual(!!obj, true);
  });

  it("Web GDPR", () => {
    const obj = AsnParser.parse(Convert.FromBase64(id_0_4_0_9496_7), WebGDPR);

    assert.strictEqual(!!obj, true);
  });

  it("Insurance Value", () => {
    const obj = AsnParser.parse(Convert.FromBase64(id_0_4_0_9496_8), InsuranceValue);

    assert.strictEqual(!!obj, true);
    assert.strictEqual(obj.toString(), "1000 x 10^2 EUR");
  });

  it("Insurance Value", () => {
    const obj = AsnParser.parse(Convert.FromBase64(id_0_4_0_9496_9), ValuationRanking);

    assert.strictEqual(!!obj, true);
  });
});

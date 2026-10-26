# `@peculiar/asn1-lei`

[![License](https://img.shields.io/badge/license-MIT-green.svg?style=flat)](https://github.com/PeculiarVentures/asn1-schema/blob/master/packages/lei/LICENSE)
[![npm version](https://badge.fury.io/js/%40peculiar%2Fasn1-lei.svg)](https://badge.fury.io/js/%40peculiar%2Fasn1-lei)

[![NPM](https://nodei.co/npm/@peculiar/asn1-lei.png)](https://nodei.co/npm/@peculiar/asn1-lei/)

ASN.1 schema for Legal Entity Identifier (LEI) attributes used in digital certificates and ISO 17442-2 profiles.

Use the exported classes with `@peculiar/asn1-schema` helpers such as `AsnConvert`, `AsnParser`, and `AsnSerializer` to parse or serialize DER-encoded data defined by the referenced specification.

## Installation

```bash
npm install @peculiar/asn1-lei
```

## Breaking Changes In v3

v3 is ESM-only and requires Node.js `^20.19.0 || >=22.12.0` (was `>=14`). CommonJS code can still `require("@peculiar/asn1-lei")` on these versions; Node.js 22.0–22.11 can't. The public API is unchanged. See the [full notes](https://github.com/PeculiarVentures/asn1-schema#breaking-changes-in-v3).

- **TypeScript compiling to CommonJS:** use `"module": "node20"` or `"nodenext"` (`node16` fails with TS1479). ESM and bundler setups need no changes.
- **Jest in CommonJS mode:** switch to ESM mode or Vitest, or configure an ESM-to-CommonJS transformer and make sure `transformIgnorePatterns` doesn't exclude the `@peculiar/*` packages and `asn1js`.
- **Deep imports** (`@peculiar/asn1-lei/build/...`) are blocked by `exports`; import from `@peculiar/asn1-lei`.
- **Peer dependencies:** `@peculiar/asn1-schema` (`^3.0.0`) and `asn1js` (`^4.0.0`) are peers instead of dependencies, so your app shares one copy with the other `@peculiar/asn1-*` packages. npm installs peers automatically.

## Specifications

- [Legal Entity Identifier in Digital Certificates](https://www.ubisecure.com/legal-entity-identifier-lei/lei-in-digital-certificates-best-practice-definitions/)
- [ISO 17442-2:2020](https://cdn.standards.iteh.ai/samples/79917/71eede156b4a4ad589b2b2eb1a4455fa/ISO-17442-2-2020.pdf)

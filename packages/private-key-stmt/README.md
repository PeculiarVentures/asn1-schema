# `@peculiar/asn1-private-key-stmt`

[![License](https://img.shields.io/badge/license-MIT-green.svg?style=flat)](https://github.com/PeculiarVentures/asn1-schema/blob/master/packages/private-key-stmt/LICENSE)
[![npm version](https://badge.fury.io/js/%40peculiar%2Fasn1-private-key-stmt.svg)](https://badge.fury.io/js/%40peculiar%2Fasn1-private-key-stmt)

[![NPM](https://nodei.co/npm/@peculiar/asn1-private-key-stmt.png)](https://nodei.co/npm/@peculiar/asn1-private-key-stmt/)

ASN.1 schema for the Private Key Statement attribute defined by the IETF LAMPS private-key-statement draft.

Use the exported classes with `@peculiar/asn1-schema` helpers such as `AsnConvert`, `AsnParser`, and `AsnSerializer` to parse or serialize DER-encoded data defined by the referenced specification.

## Installation

```bash
npm install @peculiar/asn1-private-key-stmt
```

## Breaking Changes In v3

v3 is ESM-only and requires Node.js `^20.19.0 || >=22.12.0` (was `>=14`). CommonJS code can still `require("@peculiar/asn1-private-key-stmt")` on these versions; Node.js 22.0–22.11 can't. The public API is unchanged. See the [full notes](https://github.com/PeculiarVentures/asn1-schema#breaking-changes-in-v3).

- **TypeScript compiling to CommonJS:** use `"module": "node20"` or `"nodenext"` (`node16` fails with TS1479). ESM and bundler setups need no changes.
- **Jest in CommonJS mode:** switch to ESM mode or Vitest, or configure an ESM-to-CommonJS transformer and make sure `transformIgnorePatterns` doesn't exclude the `@peculiar/*` packages and `asn1js`.
- **Deep imports** (`@peculiar/asn1-private-key-stmt/build/...`) are blocked by `exports`; import from `@peculiar/asn1-private-key-stmt`.
- **Peer dependencies:** `@peculiar/asn1-schema` (`^3.0.0`) is a peer instead of a dependency, so your app shares one copy with the other `@peculiar/asn1-*` packages. npm installs peers automatically.

## Specifications

- [IETF LAMPS Private Key Statement Attribute draft](https://datatracker.ietf.org/doc/draft-ietf-lamps-private-key-stmt-attr/09/)

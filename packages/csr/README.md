# `@peculiar/asn1-csr`

[![License](https://img.shields.io/badge/license-MIT-green.svg?style=flat)](https://github.com/PeculiarVentures/asn1-schema/blob/master/packages/csr/LICENSE)
[![npm version](https://badge.fury.io/js/%40peculiar%2Fasn1-csr.svg)](https://badge.fury.io/js/%40peculiar%2Fasn1-csr)

[![NPM](https://nodei.co/npm/@peculiar/asn1-csr.png)](https://nodei.co/npm/@peculiar/asn1-csr/)

ASN.1 schema for PKCS #10 certificate signing requests defined in RFC 2986.

Use the exported classes with `@peculiar/asn1-schema` helpers such as `AsnConvert`, `AsnParser`, and `AsnSerializer` to parse or serialize DER-encoded data defined by the referenced specification.

## Installation

```bash
npm install @peculiar/asn1-csr
```

## Breaking Changes In v3

v3 is ESM-only and requires Node.js `^20.19.0 || >=22.12.0` (was `>=14`). CommonJS code can still `require("@peculiar/asn1-csr")` on these versions; Node.js 22.0–22.11 can't. The public API is unchanged. See the [full notes](https://github.com/PeculiarVentures/asn1-schema#breaking-changes-in-v3).

- **TypeScript compiling to CommonJS:** use `"module": "node20"` or `"nodenext"` (`node16` fails with TS1479). ESM and bundler setups need no changes.
- **Jest in CommonJS mode:** switch to ESM mode or Vitest, or configure an ESM-to-CommonJS transformer and make sure `transformIgnorePatterns` doesn't exclude the `@peculiar/*` packages and `asn1js`.
- **Deep imports** (`@peculiar/asn1-csr/build/...`) are blocked by `exports`; import from `@peculiar/asn1-csr`.
- **Peer dependencies:** `@peculiar/asn1-schema` (`^3.0.0`) is a peer instead of a dependency, so your app shares one copy with the other `@peculiar/asn1-*` packages. npm installs peers automatically.

## Specifications

- [RFC 2986: PKCS #10 Certification Request Syntax Specification](https://datatracker.ietf.org/doc/html/rfc2986)

<h1 align="center">
  @peculiar/asn1-x509-logotype
</h1>

<div align="center">

![NPM License](https://img.shields.io/npm/l/@peculiar/asn1-x509-logotype)
![GitHub Actions Workflow Status](https://img.shields.io/github/actions/workflow/status/PeculiarVentures/asn1-schema/release.yml?branch=master&label=release)
[![npm version](https://img.shields.io/npm/v/@peculiar/asn1-x509-logotype.svg)](https://www.npmjs.com/package/@peculiar/asn1-x509-logotype)
![Coveralls](https://img.shields.io/coverallsCoverage/github/PeculiarVentures/asn1-schema)
[![npm downloads](https://img.shields.io/npm/dm/@peculiar/asn1-x509-logotype.svg)](https://www.npmjs.com/package/@peculiar/asn1-x509-logotype)

</div>

ASN.1 schema for X.509 certificate logotype extensions defined in RFC 3709 and RFC 9399.

Use the exported classes with `@peculiar/asn1-schema` helpers such as `AsnConvert`, `AsnParser`, and `AsnSerializer` to parse or serialize DER-encoded data defined by the referenced specification.

## Installation

```bash
npm install @peculiar/asn1-x509-logotype
```

## Breaking Changes In v3

v3 is ESM-only and requires Node.js `^20.19.0 || >=22.12.0` (was `>=14`). CommonJS code can still `require("@peculiar/asn1-x509-logotype")` on these versions; Node.js 22.0–22.11 can't. The public API is unchanged. See the [full notes](https://github.com/PeculiarVentures/asn1-schema#breaking-changes-in-v3).

- **TypeScript compiling to CommonJS:** use `"module": "node20"` or `"nodenext"` (`node16` fails with TS1479). ESM and bundler setups need no changes.
- **Jest in CommonJS mode:** switch to ESM mode or Vitest, or configure an ESM-to-CommonJS transformer and make sure `transformIgnorePatterns` doesn't exclude the `@peculiar/*` packages and `asn1js`.
- **Deep imports** (`@peculiar/asn1-x509-logotype/build/...`) are blocked by `exports`; import from `@peculiar/asn1-x509-logotype`.
- **Peer dependencies:** `@peculiar/asn1-schema` (`^3.0.0`) is a peer instead of a dependency, so your app shares one copy with the other `@peculiar/asn1-*` packages. npm installs peers automatically.

## Specifications

- [RFC 3709: Logotypes in X.509 Certificates](https://www.rfc-editor.org/rfc/rfc3709.html)
- [RFC 9399: Updates for Logotypes in X.509 Certificates](https://www.rfc-editor.org/rfc/rfc9399.html)

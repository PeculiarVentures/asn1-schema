<h1 align="center">
  @peculiar/asn1-ecc
</h1>

<div align="center">

![NPM License](https://img.shields.io/npm/l/@peculiar/asn1-ecc)
![GitHub Actions Workflow Status](https://img.shields.io/github/actions/workflow/status/PeculiarVentures/asn1-schema/release.yml?branch=master&label=release)
[![npm version](https://img.shields.io/npm/v/@peculiar/asn1-ecc.svg)](https://www.npmjs.com/package/@peculiar/asn1-ecc)
![Coveralls](https://img.shields.io/coverallsCoverage/github/PeculiarVentures/asn1-schema)
[![npm downloads](https://img.shields.io/npm/dm/@peculiar/asn1-ecc.svg)](https://www.npmjs.com/package/@peculiar/asn1-ecc)

</div>

ASN.1 schema for elliptic-curve private keys and related identifiers defined in RFC 5915, RFC 5480, and RFC 3279.

Use the exported classes with `@peculiar/asn1-schema` helpers such as `AsnConvert`, `AsnParser`, and `AsnSerializer` to parse or serialize DER-encoded data defined by the referenced specification.

## Installation

```bash
npm install @peculiar/asn1-ecc
```

## Breaking Changes In v3

v3 is ESM-only and requires Node.js `^20.19.0 || >=22.12.0` (was `>=14`). CommonJS code can still `require("@peculiar/asn1-ecc")` on these versions; Node.js 22.0–22.11 can't. The public API is unchanged. See the [full notes](https://github.com/PeculiarVentures/asn1-schema#breaking-changes-in-v3).

- **TypeScript compiling to CommonJS:** use `"module": "node20"` or `"nodenext"` (`node16` fails with TS1479). ESM and bundler setups need no changes.
- **Jest in CommonJS mode:** switch to ESM mode or Vitest, or configure an ESM-to-CommonJS transformer and make sure `transformIgnorePatterns` doesn't exclude the `@peculiar/*` packages and `asn1js`.
- **Deep imports** (`@peculiar/asn1-ecc/build/...`) are blocked by `exports`; import from `@peculiar/asn1-ecc`.
- **Peer dependencies:** `@peculiar/asn1-schema` (`^3.0.0`) is a peer instead of a dependency, so your app shares one copy with the other `@peculiar/asn1-*` packages. npm installs peers automatically.

## Specifications

- [RFC 5915: Elliptic Curve Private Key Structure](https://datatracker.ietf.org/doc/html/rfc5915)
- [RFC 5480: Elliptic Curve Cryptography Subject Public Key Information](https://datatracker.ietf.org/doc/html/rfc5480)
- [RFC 3279: Algorithms and Identifiers for the Internet X.509 Public Key Infrastructure Certificate and CRL Profile](https://datatracker.ietf.org/doc/html/rfc3279#section-2.3.5)

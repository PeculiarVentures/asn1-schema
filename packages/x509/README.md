<h1 align="center">
  @peculiar/asn1-x509
</h1>

<div align="center">

![NPM License](https://img.shields.io/npm/l/@peculiar/asn1-x509)
![GitHub Actions Workflow Status](https://img.shields.io/github/actions/workflow/status/PeculiarVentures/asn1-schema/release.yml?branch=master&label=release)
[![npm version](https://img.shields.io/npm/v/@peculiar/asn1-x509.svg)](https://www.npmjs.com/package/@peculiar/asn1-x509)
![Coveralls](https://img.shields.io/coverallsCoverage/github/PeculiarVentures/asn1-schema)
[![npm downloads](https://img.shields.io/npm/dm/@peculiar/asn1-x509.svg)](https://www.npmjs.com/package/@peculiar/asn1-x509)

</div>

ASN.1 schema for X.509 certificates, certificate revocation lists, and related profile structures defined in RFC 5280.

Use the exported classes with `@peculiar/asn1-schema` helpers such as `AsnConvert`, `AsnParser`, and `AsnSerializer` to parse or serialize DER-encoded data defined by the referenced specification.

## Installation

```bash
npm install @peculiar/asn1-x509
```

## Breaking Changes In v3

v3 is ESM-only and requires Node.js `^20.19.0 || >=22.12.0` (was `>=14`). CommonJS code can still `require("@peculiar/asn1-x509")` on these versions; Node.js 22.0–22.11 can't. The public API is unchanged. See the [full notes](https://github.com/PeculiarVentures/asn1-schema#breaking-changes-in-v3).

- **TypeScript compiling to CommonJS:** use `"module": "node20"` or `"nodenext"` (`node16` fails with TS1479). ESM and bundler setups need no changes.
- **Jest in CommonJS mode:** switch to ESM mode or Vitest, or configure an ESM-to-CommonJS transformer and make sure `transformIgnorePatterns` doesn't exclude the `@peculiar/*` packages and `asn1js`.
- **Deep imports** (`@peculiar/asn1-x509/build/...`) are blocked by `exports`; import from `@peculiar/asn1-x509`.
- **Peer dependencies:** `@peculiar/asn1-schema` (`^3.0.0`) and `asn1js` (`^4.0.0`) are peers instead of dependencies, so your app shares one copy with the other `@peculiar/asn1-*` packages. npm installs peers automatically.

## Specifications

- [RFC 5280: Internet X.509 Public Key Infrastructure Certificate and Certificate Revocation List (CRL) Profile](https://datatracker.ietf.org/doc/html/rfc5280)
- [EntrustVersionInfo extension reference](http://ftp.gnome.org/mirror/archive/ftp.sunet.se/pub/security/dfnpca/docs/misc/Entrust/directory.pdf)

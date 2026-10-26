<h1 align="center">
  @peculiar/asn1-mtc
</h1>

<div align="center">

![NPM License](https://img.shields.io/npm/l/@peculiar/asn1-mtc)
![GitHub Actions Workflow Status](https://img.shields.io/github/actions/workflow/status/PeculiarVentures/asn1-schema/release.yml?branch=master&label=release)
[![npm version](https://img.shields.io/npm/v/@peculiar/asn1-mtc.svg)](https://www.npmjs.com/package/@peculiar/asn1-mtc)
![Coveralls](https://img.shields.io/coverallsCoverage/github/PeculiarVentures/asn1-schema)
[![npm downloads](https://img.shields.io/npm/dm/@peculiar/asn1-mtc.svg)](https://www.npmjs.com/package/@peculiar/asn1-mtc)

</div>

ASN.1 schema and TLS-encoded proof structures for Merkle Tree Certificates defined in draft-ietf-plants-merkle-tree-certs.

Use the exported classes with `@peculiar/asn1-schema` helpers such as `AsnConvert`, `AsnParser`, and `AsnSerializer` to parse or serialize DER-encoded data defined by the referenced specification.

`MTCProof` is not DER. It is carried in a certificate's `signatureValue` in the TLS presentation language with no ASN.1 wrapping, so it is parsed with `MTCProof.parse` rather than through `AsnConvert`.

## Installation

```bash
npm install @peculiar/asn1-mtc
```

## Breaking Changes In v3

v3 is ESM-only and requires Node.js `^20.19.0 || >=22.12.0` (was `>=14`). CommonJS code can still `require("@peculiar/asn1-mtc")` on these versions; Node.js 22.0–22.11 can't. The public API is unchanged. See the [full notes](https://github.com/PeculiarVentures/asn1-schema#breaking-changes-in-v3).

- **TypeScript compiling to CommonJS:** use `"module": "node20"` or `"nodenext"` (`node16` fails with TS1479). ESM and bundler setups need no changes.
- **Jest in CommonJS mode:** switch to ESM mode or Vitest, or configure an ESM-to-CommonJS transformer and make sure `transformIgnorePatterns` doesn't exclude the `@peculiar/*` packages and `asn1js`.
- **Deep imports** (`@peculiar/asn1-mtc/build/...`) are blocked by `exports`; import from `@peculiar/asn1-mtc`.
- **Peer dependencies:** `@peculiar/asn1-schema` (`^3.0.0`) is a peer instead of a dependency, so your app shares one copy with the other `@peculiar/asn1-*` packages. npm installs peers automatically.

## Overview

```js
import { AsnConvert } from "@peculiar/asn1-schema";
import { MTCCertificationAuthority, MTCProof, decodeSerialNumber } from "@peculiar/asn1-mtc";

// Critical extension in an MTC CA certificate
const ca = AsnConvert.parse(extnValue, MTCCertificationAuthority);

// Proof in a subscriber certificate's signatureValue
const proof = MTCProof.parse(signatureValue, { hashSize: 32 });
console.log(proof.start, proof.end, proof.isLandmarkRelative);

// Serial number encodes the issuance log and entry index
const { logNumber, index } = decodeSerialNumber(serialNumber);
```

## Specifications

- [draft-ietf-plants-merkle-tree-certs: Merkle Tree Certificates](https://datatracker.ietf.org/doc/draft-ietf-plants-merkle-tree-certs/)
- [draft-ietf-tls-trust-anchor-ids: Trust Anchor Identifiers](https://datatracker.ietf.org/doc/draft-ietf-tls-trust-anchor-ids/)
- [RFC 9925: Unsigned X.509 Certificates](https://www.rfc-editor.org/rfc/rfc9925.html)

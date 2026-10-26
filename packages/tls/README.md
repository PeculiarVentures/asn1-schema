<h1 align="center">
  @peculiar/asn1-tls
</h1>

<div align="center">

![NPM License](https://img.shields.io/npm/l/@peculiar/asn1-tls)
![GitHub Actions Workflow Status](https://img.shields.io/github/actions/workflow/status/PeculiarVentures/asn1-schema/release.yml?branch=master&label=release)
[![npm version](https://img.shields.io/npm/v/@peculiar/asn1-tls.svg)](https://www.npmjs.com/package/@peculiar/asn1-tls)
![Coveralls](https://img.shields.io/coverallsCoverage/github/PeculiarVentures/asn1-schema)
[![npm downloads](https://img.shields.io/npm/dm/@peculiar/asn1-tls.svg)](https://www.npmjs.com/package/@peculiar/asn1-tls)

</div>

TLS presentation language byte stream reader shared by Certificate Transparency and Merkle Tree Certificate packages.

`ByteStream` is a minimal cursor over a byte buffer that reads big-endian integers, fixed-length fields, and length-prefixed vectors, and raises on truncation so malformed input fails loudly instead of yielding short reads.

## Installation

```bash
npm install @peculiar/asn1-tls
```

## Breaking Changes In v3

v3 is ESM-only and requires Node.js `^20.19.0 || >=22.12.0` (was `>=14`). CommonJS code can still `require("@peculiar/asn1-tls")` on these versions; Node.js 22.0–22.11 can't. The public API is unchanged. See the [full notes](https://github.com/PeculiarVentures/asn1-schema#breaking-changes-in-v3).

- **TypeScript compiling to CommonJS:** use `"module": "node20"` or `"nodenext"` (`node16` fails with TS1479). ESM and bundler setups need no changes.
- **Jest in CommonJS mode:** switch to ESM mode or Vitest, or configure an ESM-to-CommonJS transformer and make sure `transformIgnorePatterns` doesn't exclude the `@peculiar/*` packages.
- **Deep imports** (`@peculiar/asn1-tls/build/...`) are blocked by `exports`; import from `@peculiar/asn1-tls`.

## Overview

```js
import { ByteStream } from "@peculiar/asn1-tls";

const stream = new ByteStream(bytes);
const length = stream.readNumber(2);
const payload = stream.readVector(2);
console.log(stream.position, stream.left);
```

## Specifications

- [RFC 6962: Certificate Transparency](https://www.rfc-editor.org/rfc/rfc6962.html)
- [draft-ietf-plants-merkle-tree-certs: Merkle Tree Certificates](https://datatracker.ietf.org/doc/draft-ietf-plants-merkle-tree-certs/)

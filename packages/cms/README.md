<h1 align="center">
  @peculiar/asn1-cms
</h1>

<div align="center">

![NPM License](https://img.shields.io/npm/l/@peculiar/asn1-cms)
![GitHub Actions Workflow Status](https://img.shields.io/github/actions/workflow/status/PeculiarVentures/asn1-schema/release.yml?branch=master&label=release)
[![npm version](https://img.shields.io/npm/v/@peculiar/asn1-cms.svg)](https://www.npmjs.com/package/@peculiar/asn1-cms)
![Coveralls](https://img.shields.io/coverallsCoverage/github/PeculiarVentures/asn1-schema)
[![npm downloads](https://img.shields.io/npm/dm/@peculiar/asn1-cms.svg)](https://www.npmjs.com/package/@peculiar/asn1-cms)

</div>

ASN.1 schema for Cryptographic Message Syntax (CMS) defined in RFC 5652.

Use the exported classes with `@peculiar/asn1-schema` helpers such as `AsnConvert`, `AsnParser`, and `AsnSerializer` to parse or serialize DER-encoded data defined by the referenced specification.

## Installation

```bash
npm install @peculiar/asn1-cms
```

## Breaking Changes In v3

v3 is ESM-only and requires Node.js `^20.19.0 || >=22.12.0` (was `>=14`). CommonJS code can still `require("@peculiar/asn1-cms")` on these versions; Node.js 22.0–22.11 can't. The public API is unchanged. See the [full notes](https://github.com/PeculiarVentures/asn1-schema#breaking-changes-in-v3).

- **TypeScript compiling to CommonJS:** use `"module": "node20"` or `"nodenext"` (`node16` fails with TS1479). ESM and bundler setups need no changes.
- **Jest in CommonJS mode:** switch to ESM mode or Vitest, or configure an ESM-to-CommonJS transformer and make sure `transformIgnorePatterns` doesn't exclude the `@peculiar/*` packages and `asn1js`.
- **Deep imports** (`@peculiar/asn1-cms/build/...`) are blocked by `exports`; import from `@peculiar/asn1-cms`.
- **Peer dependencies:** `@peculiar/asn1-schema` (`^3.0.0`) is a peer instead of a dependency, so your app shares one copy with the other `@peculiar/asn1-*` packages. npm installs peers automatically.

## Specifications

- [RFC 5652: Cryptographic Message Syntax (CMS)](https://datatracker.ietf.org/doc/html/rfc5652)
- [RFC 3565: Use of the Advanced Encryption Standard (AES) Encryption Algorithm in Cryptographic Message Syntax (CMS)](https://datatracker.ietf.org/doc/html/rfc3565)

## AES Algorithm Identifiers

RFC 3565 OIDs are exported as `id_aes128_CBC`, `id_aes192_CBC`, `id_aes256_CBC`, `id_aes128_wrap`, `id_aes192_wrap`, and `id_aes256_wrap`, with `id_aes` as their base arc.

For CMS `AlgorithmIdentifier` values, AES-CBC parameters contain a 16-byte IV encoded as an ASN.1 OCTET STRING. AES key wrap parameters are absent (omit `parameters`; do not use `null`).

```typescript
import { id_aes256_CBC, id_aes256_wrap } from "@peculiar/asn1-cms";
import { AsnConvert, OctetString } from "@peculiar/asn1-schema";
import { AlgorithmIdentifier } from "@peculiar/asn1-x509";

// Pass the 16-byte IV supplied by your encryption implementation.
function aesCbcIdentifier(iv: Uint8Array): AlgorithmIdentifier {
  if (iv.byteLength !== 16) {
    throw new RangeError("AES-CBC IV must be 16 bytes");
  }

  return new AlgorithmIdentifier({
    algorithm: id_aes256_CBC,
    parameters: AsnConvert.serialize(new OctetString(iv)),
  });
}

const keyWrapIdentifier = new AlgorithmIdentifier({ algorithm: id_aes256_wrap });
const keyWrapDer = AsnConvert.serialize(keyWrapIdentifier);
```

These examples describe algorithm identifiers used by CMS encryption and key management. `SMIMECapabilities` advertises algorithm support and has separate parameter rules: RFC 3565 AES-CBC capability entries omit parameters. These OIDs do not add cryptographic operations or parameter validation.

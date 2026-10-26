<h1 align="center">
  @peculiar/asn1-apple
</h1>

<div align="center">

![NPM License](https://img.shields.io/npm/l/@peculiar/asn1-apple)
![GitHub Actions Workflow Status](https://img.shields.io/github/actions/workflow/status/PeculiarVentures/asn1-schema/release.yml?branch=master&label=release)
[![npm version](https://img.shields.io/npm/v/@peculiar/asn1-apple.svg)](https://www.npmjs.com/package/@peculiar/asn1-apple)
![Coveralls](https://img.shields.io/coverallsCoverage/github/PeculiarVentures/asn1-schema)
[![npm downloads](https://img.shields.io/npm/dm/@peculiar/asn1-apple.svg)](https://www.npmjs.com/package/@peculiar/asn1-apple)

</div>

ASN.1 schema for Apple App Attest nonce extensions.

Use the exported classes with `@peculiar/asn1-schema` helpers such as `AsnConvert`, `AsnParser`, and `AsnSerializer` to parse or serialize DER-encoded App Attest data.

## Installation

```bash
npm install @peculiar/asn1-apple
```

## Breaking Changes In v3

v3 is ESM-only and requires Node.js `^20.19.0 || >=22.12.0` (was `>=14`). CommonJS code can still `require("@peculiar/asn1-apple")` on these versions; Node.js 22.0–22.11 can't. The public API is unchanged. See the [full notes](https://github.com/PeculiarVentures/asn1-schema#breaking-changes-in-v3).

- **TypeScript compiling to CommonJS:** use `"module": "node20"` or `"nodenext"` (`node16` fails with TS1479). ESM and bundler setups need no changes.
- **Jest in CommonJS mode:** switch to ESM mode or Vitest, or configure an ESM-to-CommonJS transformer and make sure `transformIgnorePatterns` doesn't exclude the `@peculiar/*` packages and `asn1js`.
- **Deep imports** (`@peculiar/asn1-apple/build/...`) are blocked by `exports`; import from `@peculiar/asn1-apple`.
- **Peer dependencies:** `@peculiar/asn1-schema` (`^3.0.0`) is a peer instead of a dependency, so your app shares one copy with the other `@peculiar/asn1-*` packages. npm installs peers automatically.

## References

- [Validating apps that connect to your server](https://developer.apple.com/documentation/devicecheck/validating-apps-that-connect-to-your-server)
- [DeviceCheck](https://developer.apple.com/documentation/devicecheck)

## Example

```typescript
import { AsnConvert, OctetString } from "@peculiar/asn1-schema";
import { AppAttestNonce } from "@peculiar/asn1-apple";

const nonce = new AppAttestNonce({
  nonce: new OctetString(Buffer.from("nonce-value", "utf8")),
});

const raw = AsnConvert.serialize(nonce);
const parsed = AsnConvert.parse(raw, AppAttestNonce);
```

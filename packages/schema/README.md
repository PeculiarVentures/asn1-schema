<h1 align="center">
  @peculiar/asn1-schema
</h1>

<div align="center">

![NPM License](https://img.shields.io/npm/l/@peculiar/asn1-schema)
![GitHub Actions Workflow Status](https://img.shields.io/github/actions/workflow/status/PeculiarVentures/asn1-schema/release.yml?branch=master&label=release)
[![npm version](https://img.shields.io/npm/v/@peculiar/asn1-schema.svg)](https://www.npmjs.com/package/@peculiar/asn1-schema)
![Coveralls](https://img.shields.io/coverallsCoverage/github/PeculiarVentures/asn1-schema)
[![npm downloads](https://img.shields.io/npm/dm/@peculiar/asn1-schema.svg)](https://www.npmjs.com/package/@peculiar/asn1-schema)

</div>

Decorators and helper APIs for declaring ASN.1 schemas in TypeScript.

This is the core package used by the schema modules in this repository. It lets you describe DER structures with decorators and convert them with `AsnConvert`, `AsnParser`, and `AsnSerializer`.

## Installation

```bash
npm install @peculiar/asn1-schema
```

## Breaking Changes In v3

v3 is ESM-only and requires Node.js `^20.19.0 || >=22.12.0` (was `>=14`). CommonJS code can still `require("@peculiar/asn1-schema")` on these versions; Node.js 22.0–22.11 can't. The public API is unchanged. See the [full notes](https://github.com/PeculiarVentures/asn1-schema#breaking-changes-in-v3).

- **TypeScript compiling to CommonJS:** use `"module": "node20"` or `"nodenext"` (`node16` fails with TS1479). ESM and bundler setups need no changes.
- **Jest in CommonJS mode:** switch to ESM mode or Vitest, or configure an ESM-to-CommonJS transformer and make sure `transformIgnorePatterns` doesn't exclude the `@peculiar/*` packages and `asn1js`.
- **Deep imports** (`@peculiar/asn1-schema/build/...`) are blocked by `exports`; import from `@peculiar/asn1-schema`.
- **asn1js 4 is a peer dependency** (v2 depended on asn1js 3). npm installs it automatically; if your app imports `asn1js` too, use v4. The converters check `instanceof asn1js.*`, so values you pass in must come from the same asn1js copy. See the [asn1js 4 breaking changes](https://github.com/PeculiarVentures/ASN1.js#breaking-changes-in-v4) for encoding differences.

## Overview

Abstract Syntax Notation One (ASN.1) is widely used across X.509, PKCS, CMS, OCSP, and related standards. This package keeps those mappings declarative and type-friendly by attaching schema metadata directly to classes.

## TypeScript Example

```ts
import { AsnConvert, AsnProp, AsnPropTypes, AsnType, AsnTypeTypes } from "@peculiar/asn1-schema";

@AsnType({ type: AsnTypeTypes.Sequence })
class BasicConstraints {
  @AsnProp({ type: AsnPropTypes.Boolean, defaultValue: false })
  public cA = false;
}

const basicConstraints = new BasicConstraints();
basicConstraints.cA = true;

const encoded = AsnConvert.serialize(basicConstraints);
const decoded = AsnConvert.parse(encoded, BasicConstraints);

console.log(decoded.cA);
```

## Related Links

- [Decorators overview](https://medium.com/google-developers/exploring-es7-decorators-76ecb65fb841)
- [ASN.1 playground](http://lapo.it/asn1js/)

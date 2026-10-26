# `asn1-schema`

[![License](https://img.shields.io/badge/license-MIT-green.svg?style=flat)](https://raw.githubusercontent.com/PeculiarVentures/asn1-schema/master/LICENSE.md)
[![Release](https://github.com/PeculiarVentures/asn1-schema/actions/workflows/release.yml/badge.svg?branch=master)](https://github.com/PeculiarVentures/asn1-schema/actions/workflows/release.yml)
[![Coverage Status](https://coveralls.io/repos/github/PeculiarVentures/asn1-schema/badge.svg)](https://coveralls.io/github/PeculiarVentures/asn1-schema)

`asn1-schema` is a collection of TypeScript schemas that make working with common ASN.1 objects easy.

## Breaking Changes In v3

v3 is ESM-only and requires Node.js `^20.19.0 || >=22.12.0` (was `>=14`). All `@peculiar/asn1-*` packages move to v3 together; don't mix them with v2 packages. CommonJS code can still `require()` them on these versions; Node.js 22.0–22.11 can't (`ERR_REQUIRE_ESM`). The public API of every package is unchanged.

- **One ESM build per package:** `build/cjs`, `build/es2015` and `build/types` are replaced by `build/*.js` with `.d.ts` files next to them. `main`, `module` and `types` still point at the root entry for older resolvers.
- **Deep imports** (`@peculiar/asn1-x509/build/cjs/...`, `.../build/es2015/...`, `.../build/types/...`) are blocked by the new `exports` map; import from the package name.
- **TypeScript compiling to CommonJS:** use `"module": "node20"` or `"nodenext"` (`node16` fails with TS1479). ESM and bundler setups need no changes. Using the schema classes doesn't need `experimentalDecorators`; only code that declares its own schemas with `@AsnType`/`@AsnProp` does, as before.
- **Jest in CommonJS mode:** switch to ESM mode or Vitest, or configure an ESM-to-CommonJS transformer and make sure `transformIgnorePatterns` doesn't exclude the `@peculiar/*` packages and `asn1js`.
- **Peer dependencies:** the decorators register every schema in the storage of the `@peculiar/asn1-schema` copy they were loaded with, and the converters check `instanceof asn1js.*`, so two copies of either break parsing at runtime (`Cannot get schema for '...' target`). Every `@peculiar/asn1-*` package now has `@peculiar/asn1-schema` `^3.0.0` as a peer, and `@peculiar/asn1-schema`, `asn1-x509`, `asn1-cert-transparency` and `asn1-lei` have `asn1js` `^4.0.0` as a peer. npm 7+ installs peers automatically, and a conflicting version now fails at install (`ERESOLVE`) instead of at runtime. Dependencies between the other packages (for example `asn1-cms` → `asn1-x509`) stay regular dependencies.
- **asn1js 4:** objects built with asn1js 3 fail the `instanceof` checks, and asn1js 4 changes a few encodings; see its [breaking changes](https://github.com/PeculiarVentures/ASN1.js#breaking-changes-in-v4). Libraries built on asn1-schema 2 (such as `@peculiar/x509` 2 and `webcrypto-core` 1) have to move to v3 at the same time.
- **Dependencies:** `tslib` is gone, and `@peculiar/utils` moves from 2 to 4 (same functions, ESM-only).

## List of schemas

- [adobe acrobat](packages/adobe-acrobat/README.md)
- [android](packages/android/README.md)
- [cert transparency](packages/cert-transparency/README.md) (RFC 6962)
- [cms](packages/cms/README.md) (RFC 5652)
- [csr](packages/csr/README.md) (RFC 2986)
- [crmf](packages/crmf/README.md) (RFC 4211)
- [ecc](packages/ecc/README.md) (RFC 5915, RFC 5480)
- [lei](packages/lei/README.md)
- [mtc](packages/mtc/README.md) (draft-ietf-plants-merkle-tree-certs)
- [ntqwac](packages/ntqwac/README.md)
- [ocsp](packages/ocsp/README.md) (RFC 6960)
- [pfx](packages/pfx/README.md) (RFC 7292)
- [pkcs8](packages/pkcs8/README.md) (RFC 5208)
- [pkcs9](packages/pkcs9/README.md) (RFC 2985)
- [private key stmt](packages/private-key-stmt/README.md) ([IETF LAMPS Private Key Statement Attribute](https://datatracker.ietf.org/doc/draft-ietf-lamps-private-key-stmt-attr/09/))
- [rfc8226](packages/rfc8226/README.md) (RFC 8226)
- [rsa](packages/rsa/README.md) (RFC 8017)
- [tsp](packages/tsp/README.md) (RFC 3161)
- [tls](packages/tls/README.md)
- [x509](packages/x509/README.md) (RFC 5280)
- [x509 attr](packages/x509-attr/README.md) (RFC 5755)
- [x509 logotype](packages/x509-logotype/README.md) (RFC 3709)
- [x509 netscape](packages/x509-netscape/README.md)
- [x509 qualified](packages/x509-qualified/README.md) (RFC 3739)
- [x509 qualified etsi](packages/x509-qualified-etsi/README.md)
- [x509 trustanchor](packages/x509-trustanchor/README.md) (RFC 5914)

## Usage

```ts
import { AsnParser } from "@peculiar/asn1-schema";
import { Certificate } from "@peculiar/asn1-x509";

const pem = "MIIFjjCCBHagAwIBAgIMVcQBzZcO9v+nopB ... HCiLvXBWEiC6qLVM2dKZ/Ab8Xv+/3Q==";
const cert = AsnParser.parse(Buffer.from(pem, "base64"), Certificate);

console.log(cert);
```

**Output**

```plain
Certificate {
  tbsCertificate: TBSCertificate {
    version: 2,
    serialNumber: ArrayBuffer {
      [Uint8Contents]: <55 c4 01 cd 97 0e f6 ff a7 a2 90 7e>,
      byteLength: 12
    },
    signature: AlgorithmIdentifier {
      algorithm: '1.2.840.113549.1.1.11',
      parameters: null
    },
    issuer: Name { rdnSequence: [RDNSequence] },
    validity: Validity { notBefore: [Time], notAfter: [Time] },
    subject: Name { rdnSequence: [RDNSequence] },
    subjectPublicKeyInfo: SubjectPublicKeyInfo {
      algorithm: [AlgorithmIdentifier],
      subjectPublicKey: [ArrayBuffer]
    },
    extensions: [
      [Extension], [Extension],
      [Extension], [Extension],
      [Extension], [Extension],
      [Extension], [Extension],
      [Extension], [Extension]
    ]
  },
  signatureAlgorithm: AlgorithmIdentifier {
    algorithm: '1.2.840.113549.1.1.11',
    parameters: null
  },
  signatureValue: ArrayBuffer {
    [Uint8Contents]: <ab 39 6f 0d a3 67 ac bf 9d 9d 20 75 da 14 ba fd 91 c5 f5 34 db d4 17 a0 88 ec 6f d5 bd 1d d3 31 df b9 f8 85 5a b0 42 02 f6 74 3f d1 35 fa 38 cb 7e 22 09 73 6d f1 b1 b6 95 c9 49 95 a1 b1 0f 80 21 d5 e6 52 02 ee ef bd 41 31 85 d1 1e 21 58 58 74 ab a6 67 ca d6 28 39 ad ca 3e 43 be ad 0e 71 85 63 1e 67 ... 156 more bytes>,
    byteLength: 256
  }
}
```

## Development

See [CONTRIBUTING.md](CONTRIBUTING.md) for the project layout, the checks to run, how to add a package, and how releases work.

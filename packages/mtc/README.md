# `@peculiar/asn1-mtc`

[![License](https://img.shields.io/badge/license-MIT-green.svg?style=flat)](https://github.com/PeculiarVentures/asn1-schema/blob/master/packages/mtc/LICENSE)
[![npm version](https://badge.fury.io/js/%40peculiar%2Fasn1-mtc.svg)](https://badge.fury.io/js/%40peculiar%2Fasn1-mtc)

[![NPM](https://nodei.co/npm/@peculiar/asn1-mtc.png)](https://nodei.co/npm/@peculiar/asn1-mtc/)

ASN.1 schema and TLS-encoded proof structures for Merkle Tree Certificates defined in draft-ietf-plants-merkle-tree-certs.

Use the exported classes with `@peculiar/asn1-schema` helpers such as `AsnConvert`, `AsnParser`, and `AsnSerializer` to parse or serialize DER-encoded data defined by the referenced specification.

`MTCProof` is not DER. It is carried in a certificate's `signatureValue` in the TLS presentation language with no ASN.1 wrapping, so it is parsed with `MTCProof.parse` rather than through `AsnConvert`.

## Installation

```bash
npm install @peculiar/asn1-mtc
```

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

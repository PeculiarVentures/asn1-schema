# `@peculiar/asn1-tls`

[![License](https://img.shields.io/badge/license-MIT-green.svg?style=flat)](https://github.com/PeculiarVentures/asn1-schema/blob/master/packages/tls/LICENSE)
[![npm version](https://badge.fury.io/js/%40peculiar%2Fasn1-tls.svg)](https://badge.fury.io/js/%40peculiar%2Fasn1-tls)

[![NPM](https://nodei.co/npm/@peculiar/asn1-tls.png)](https://nodei.co/npm/@peculiar/asn1-tls/)

TLS presentation language byte stream reader shared by Certificate Transparency and Merkle Tree Certificate packages.

`ByteStream` is a minimal cursor over a byte buffer that reads big-endian integers, fixed-length fields, and length-prefixed vectors, and raises on truncation so malformed input fails loudly instead of yielding short reads.

## Installation

```bash
npm install @peculiar/asn1-tls
```

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

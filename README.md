# `asn1-schema`

[![License](https://img.shields.io/badge/license-MIT-green.svg?style=flat)](https://raw.githubusercontent.com/PeculiarVentures/asn1-schema/master/LICENSE.md)
[![CircleCI](https://circleci.com/gh/PeculiarVentures/asn1-schema.svg?style=svg)](https://circleci.com/gh/PeculiarVentures/asn1-schema)
[![Coverage Status](https://coveralls.io/repos/github/PeculiarVentures/asn1-schema/badge.svg?branch=master&t=ddJivl)](https://coveralls.io/github/PeculiarVentures/asn1-schema?branch=master)

`asn1-schema` is a collection of TypeScript schemas that make working with common ASN.1 objects easy. 

## List of schemas

- [cms](packages/cms/README.md) (RFC 5652)
- [ocsp](packages/ocsp/README.md) (RFC 6960)
- [x509](packages/x509/README.md) (RFC 5280)

## Usage

```ts
import { AsnParser } from "@peculiar/asn1-schema";
import { Certificate } from "@peculiar/asn1-x509";

const pem = "MIIFjjCCBHagAwIBAgIMVcQBzZcO9v+nopB ... HCiLvXBWEiC6qLVM2dKZ/Ab8Xv+/3Q==";
const cert = AsnParser.parse(Buffer.from(pem, "base64"), Certificate);

console.log(cert);
```

__Output__
```
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

### Create schema

```
yarn run create <name>
```
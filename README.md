# `asn1-schema`

[![License](https://img.shields.io/badge/license-MIT-green.svg?style=flat)](https://raw.githubusercontent.com/PeculiarVentures/asn1-schema/master/LICENSE.md)
[![Test](https://github.com/PeculiarVentures/asn1-schema/actions/workflows/test.yml/badge.svg)](https://github.com/PeculiarVentures/asn1-schema/actions/workflows/test.yml)
[![Coverage Status](https://coveralls.io/repos/github/PeculiarVentures/asn1-schema/badge.svg)](https://coveralls.io/github/PeculiarVentures/asn1-schema)

`asn1-schema` is a collection of TypeScript schemas that make working with common ASN.1 objects easy.

## List of schemas

- [adobe acrobat](packages/adobe-acrobat/README.md)
- [android](packages/android/README.md)
- [cert transparency](packages/cert-transparency/README.md) (RFC 6962)
- [cms](packages/cms/README.md) (RFC 5652)
- [csr](packages/csr/README.md) (RFC 2986)
- [crmf](packages/crmf/README.md) (RFC 4211)
- [ecc](packages/ecc/README.md) (RFC 5915, RFC 5480)
- [lei](packages/lei/README.md)
- [ntqwac](packages/ntqwac/README.md)
- [ocsp](packages/ocsp/README.md) (RFC 6960)
- [pfx](packages/pfx/README.md) (RFC 7292)
- [pkcs8](packages/pkcs8/README.md) (RFC 5208)
- [pkcs9](packages/pkcs9/README.md) (RFC 2985)
- [private key stmt](packages/private-key-stmt/README.md) ([IETF LAMPS Private Key Statement Attribute](https://datatracker.ietf.org/doc/draft-ietf-lamps-private-key-stmt-attr/09/))
- [rfc8226](packages/rfc8226/README.md) (RFC 8226)
- [rsa](packages/rsa/README.md) (RFC 8017)
- [tsp](packages/tsp/README.md) (RFC 3161)
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

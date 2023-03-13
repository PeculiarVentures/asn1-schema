# `@peculiar/asn1-x509-post-quantum`

[![License](https://img.shields.io/badge/license-MIT-green.svg?style=flat)](https://raw.githubusercontent.com/PeculiarVentures/asn1-schema/master/packages/x509-post-quantum/LICENSE.md)
[![npm version](https://badge.fury.io/js/%40peculiar%2Fasn1-x509-post-quantum.svg)](https://badge.fury.io/js/%40peculiar%2Fasn1-x509-post-quantum)

[![NPM](https://nodei.co/npm/@peculiar/asn1-x509-post-quantum.png)](https://nodei.co/npm/@peculiar/asn1-x509-post-quantum/)

This package provides ASN.1 schema definitions for composite public and private keys and composite signatures used in Internet Public Key Infrastructure (PKI), as specified in the following IETF drafts:

- [Composite Public and Private Keys For Use In Internet PKI](https://datatracker.ietf.org/doc/html/draft-ounsworth-pq-composite-keys-03)
- [Composite Signatures For Use In Internet PKI](https://datatracker.ietf.org/doc/html/draft-ounsworth-pq-composite-sigs-07)

The schema definitions are based on the `@peculiar/asn1-schema` library and can be used to encode and decode composite keys and signatures in ASN.1 DER format.

## Installation

To install this module, use the following command:

```
npm install @peculiar/asn1-x509-post-quantum
```

## Usage

The `@peculiar/asn1-x509-post-quantum` package exports several classes and constants that can be used to encode and decode composite keys and signatures. Here is an example of encoding a composite public key:

```ts
import { AsnConvert } from "@peculiar/asn1-schema";
import { CompositePublicKey, id_composite_key } from "@peculiar/asn1-x509-post-quantum";

const pem = [
  "MIIBmDAMBgpghkgBhvprUAQBA4IBhgAwggGBMFkwEwYHKoZIzj0CAQYIKoZIzj0D",
  "AQcDQgAExGPhrnuSG/fGyw1FN+l5h4p4AGRQCS0LBXnBO+djhcI6qnF2TvrQEaIY",
  "GGpQT5wHS+7y5iJJ+dE5qjxcv8loRDCCASIwDQYJKoZIhvcNAQEBBQADggEPADCC",
  "AQoCggEBANsVQK1fcLQObL4ZYtczWbObECAFSsng0OLpRTPr9VGV3SsS/VoMRZqX",
  "F+sszz6I2UcFTaMF9CwNRbWLuIBczzuhbHSjn65OuoN+Om2wsPo+okw46RTekB4a",
  "d9QQvYRVzPlILUQ8NvZ4W0BKLviXTXWIggjtp/Y1pKRHKz8n35J6OmFWz4TKGNth",
  "n87D28kmdwQYH5NLsDePHbfdw3AyLrPvQLlQw/hRPz/9Txf7yi9Djg9HtJ88ES6+",
  "ZbfE1ZHxLYLSDt25tSL8A2pMuGMD3P81nYWO+gJ0vYV2WcRpXHRkjmliGqiCg4eB",
  "mC4//tm0J4r9Ll8b/pp6xyOMI7jppVUCAwEAAQ==",
].join("");

const keyInfo = AsnConvert.parse(Buffer.from(pem, "base64"), SubjectPublicKeyInfo);
assert.strictEqual(keyInfo.algorithm.algorithm, id_composite_key);

const compositeKeys = AsnConvert.parse(keyInfo.subjectPublicKey, CompositePublicKey);
for (const key of compositeKeys) {
  console.log(key.algorithm.algorithm);
}
```

To use this module, you can import the CompositePublicKey, CompositeSignature, and CompositePrivateKey classes from the module, as follows:

```ts
import { CompositePublicKey, CompositePrivateKey, CompositeSignature } from "@peculiar/asn1-x509-post-quantum";
```

You can then use these classes to encode and decode composite public keys, private keys, and signatures using the ASN.1 format specified in the RFC 8391 specification.

For example, to encode a composite public key, you can create an instance of the CompositePublicKey class and set its fields as follows:

```ts
const publicKey = new CompositePublicKey({
  algorithmIdentifier: {
    algorithm: "1.2.840.113549.1.1.12",
    parameters: new Uint8Array([0x02, 0x03, 0x04])
  },
  keys: [
    {
      algorithm: "1.2.840.113549.1.1.11",
      publicKey: new Uint8Array([0x01, 0x02, 0x03])
    },
    {
      algorithm: "1.2.840.113549.1.1.11",
      publicKey: new Uint8Array([0x04, 0x05, 0x06])
    }
  ]
});

const encodedPublicKey = CompositePublicKey.encode(publicKey);
```

Similarly, you can decode an encoded composite public key as follows:

```
const decodedPublicKey = CompositePublicKey.decode(encodedPublicKey);
```

You can also encode and decode composite private keys and signatures in a similar way.
# `@peculiar/asn1-rfc5958`

[![License](https://img.shields.io/badge/license-MIT-green.svg?style=flat)](https://raw.githubusercontent.com/PeculiarVentures/asn1-schema/master/packages/rfc5958/LICENSE.md)
[![npm version](https://badge.fury.io/js/%40peculiar%2Fasn1-rfc5958.svg)](https://badge.fury.io/js/%40peculiar%2Fasn1-rfc5958)

[![NPM](https://nodei.co/npm/@peculiar/asn1-rfc5958.png)](https://nodei.co/npm/@peculiar/asn1-rfc5958/)

This package provides ASN.1 schema definitions for the asymmetric key packages format specified in [RFC5958](https://datatracker.ietf.org/doc/html/rfc5958). This format is used to encapsulate private and public keys, along with additional parameters and metadata, for a variety of asymmetric key algorithms.

The schema definitions are based on `@peculiar/asn1-schema` library and can be used to encode and decode key packages in ASN.1 DER format.

## Installation

You can install the package using npm:

```sh
npm install @peculiar/asn1-rfc5958
```

## Usage

The `@peculiar/asn1-rfc5958` package exports several classes and constants that can be used to encode and decode key packages. Here is an example of decoding a key package for an RSA private key:

```ts
import * as assert from "node:assert";
import { OneAsymmetricKey } from "@peculiar/asn1-rfc5958";
import { id_rsaEncryption, RSAPrivateKey } from "@peculiar/asn1-rsa";
import { AsnConvert } from "@peculiar/asn1-schema";

const pem = [
  "MIIEvQIBADANBgkqhkiG9w0BAQEFAASCBKcwggSjAgEAAoIBAQC+G9YX1BboIIty",
  "ZdjEnPeoJXh5J3UQak+lkO+KirllYeNQML7ent3l9KOp0tM/IfxSDmVWtyYAUoxM",
  "3TGnDoJgCCn5jUQIdQkPXTxa7xeL11W4d0fqyaAOyMOXA2QZShE61dBEz9ly+bnI",
  "N1MrcwLe0q/TPuKS1EBp8LS/lQzW/PrHTnDHwoGinBZq58B/ErgmPh27QlkhamdX",
  "G4KxDdN2ayilmvdG06dMwrGKs2Tag5HKbUSMPA3BlKvvqrJhMb3w86xPf2MnvWzV",
  "Wmi0tpE2zcCgXkX+4VtiikBW1QoFuFjiBWNJKWMXe2UKXYbdYFBPzaJiGCdiYXXJ",
  "u1N16pSxAgMBAAECggEAMoUjN+Hc1IMRi60VFerAxaZvhYK+0UXvNIh3n9GNwyto",
  "RP8vOent/hYtCAxGpxhY/VVmCM1TA/Lr5eFCOKraarrArNilo7m2VqboSyIOl9L5",
  "rLPGINbD+inQEGmOSEoumfwIBMFXf/5tKI/LQlimAqDqqLCldW+CTqTw45iweND8",
  "E+U9AddCIWS34KwMCqH20/m6crjW32b9CvaMVL0/S2FrXBeGj3QOxqoMCgMmx6tF",
  "GM3NlIIJIuICrZcPTB3c89LtY57uNrCe6o2nVZVh/1MKVbiuY5s3B5lhW86xT9ju",
  "qdCaatAD/xHDSo2w9KcVLhheUW2yLk0Hl3xt8+aZIQKBgQDu6lQcFGQoENNEJmeO",
  "mbb30lGLJRcK0ITNtc1VCW1eLXz2WJSu3CJ0L5cMct6awnaW0TjHG+/Hi/WhQo2k",
  "tl2AN3uLn6ZujXLuWv2NluUnEsNTexGR3iBo962budW9FmWWpFB7qWrOEu8gKUE9",
  "HMoOBa7vMq/ulgNuG8IcRFpepwKBgQDLtAlAfPpWYodrw8vbA5vvg05QyWQyj3zg",
  "go+SB+mKrXZFJv/k1JriDWajCMqMFLpcKbpzwxbN1umhq+l5zmJHG20OXR24bhfY",
  "viWPOK1v84Sy3f5xn/c8daymp1g+QdcwvPP9cjNAe1mNQNEYNg/SvDifhU8BAB6t",
  "p5B6VZj05wKBgBrjpLPEV8Fqo1x4Ng+GnWEm+qZ+dilxboD4hTOc7AI9fGL9dT54",
  "6CfLc2SjSQqB+Hbg9VLzgfkjd3G+29I99CgKFo2QWlr28IiDFSZqZUAQjItIvqF8",
  "Lomh1phAQh4V9zkNJUHFv4+R8ffcrMsEAnmxig7B1as0lw49cYtc5g7hAoGAYsBN",
  "t+ieh6BOXCzYN72hK9Sw87MeEvDCrig9J6MUUblT26RTa4Cx8SJj/md1ocEusx07",
  "mYEbHgCw1EJ99iHaPPSLwunbTZx5jQZpOOxWEC6yxu+duUG+Xp4Ba+02dz/97U+8",
  "zMI/HGRv/m1MsHsM4rGClbrPmQGQ3cic3uF+PEMCgYEAuUPGA2n5D4TtP64l3xxO",
  "C+TZzy1l+rd0yDbfnmGJxeOx6YdaPk0EwkhfUigUmSxcKR9Yv8tT//s9qzrqqwLk",
  "pCuOtlM+ru5rJRVV2/Nm2izNSn9IePGPmLhCUZUVZzQqUR0d3caNKtR8urR04Y15",
  "dll8U0BCsgO6JQPk9riOsdU=",
].join("");

const key = AsnConvert.parse(Buffer.from(pem, "base64"), OneAsymmetricKey);
assert.strictEqual(key.privateKeyAlgorithm.algorithm, id_rsaEncryption);

const rsaKey = AsnConvert.parse(key.privateKey, RSAPrivateKey);
console.log(rsaKey);
/*
RSAPrivateKey {
  version: 0,
  modulus: Uint8Array(257) [ 0, 190,  27, 214, ...],
  publicExponent: Uint8Array(3) [ 1, 0, 1 ],
  privateExponent: Uint8Array(256) [ 50, 133,  35,  55, ...],
  prime1: Uint8Array(129) [ 0, 238, 234,  84,  ...],
  prime2: Uint8Array(129) [ 0, 203, 180,   9,  ...],
  exponent1: Uint8Array(128) [ 26, 227, 164, 179, ...],
  exponent2: Uint8Array(128) [ 98, 192,  77, 183, ...],
  coefficient: Uint8Array(129) [ 0, 185,  67, 198, ...]
}
*/
```
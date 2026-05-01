# `@peculiar/asn1-apple`

[![License](https://img.shields.io/badge/license-MIT-green.svg?style=flat)](https://github.com/PeculiarVentures/asn1-schema/blob/master/packages/apple/LICENSE)
[![npm version](https://badge.fury.io/js/%40peculiar%2Fasn1-apple.svg)](https://badge.fury.io/js/%40peculiar%2Fasn1-apple)

[![NPM](https://nodei.co/npm/@peculiar/asn1-apple.png)](https://nodei.co/npm/@peculiar/asn1-apple/)

ASN.1 schema for Apple App Attest nonce extensions.

Use the exported classes with `@peculiar/asn1-schema` helpers such as `AsnConvert`, `AsnParser`, and `AsnSerializer` to parse or serialize DER-encoded App Attest data.

## Installation

```bash
npm install @peculiar/asn1-apple
```

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

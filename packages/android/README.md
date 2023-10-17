# `@peculiar/asn1-android`

[![License](https://img.shields.io/badge/license-MIT-green.svg?style=flat)](https://raw.githubusercontent.com/PeculiarVentures/asn1-schema/master/packages/android/LICENSE.md)
[![npm version](https://badge.fury.io/js/%40peculiar%2Fasn1-android.svg)](https://badge.fury.io/js/%40peculiar%2Fasn1-android)

[![NPM](https://nodei.co/npm/@peculiar/asn1-android.png)](https://nodei.co/npm/@peculiar/asn1-android/)

- [Android key attestation schema](https://source.android.com/security/keystore/attestation#schema)
- [Key attestation extension data schema](https://developer.android.com/privacy-and-security/security-key-attestation#key_attestation_ext_schema)
- [AttestationApplicationId](https://developer.android.com/privacy-and-security/security-key-attestation#key_attestation_ext_schema_attestationid)

## KeyDescription and NonStandardKeyDescription

The `KeyDescription` class in this library represents the ASN.1 schema for the Android Keystore Key Description structure. However, in practice, there are cases where the `AuthorizationList` fields in the `softwareEnforced` and `teeEnforced` fields are not strictly ordered, which can lead to ASN.1 structure reading errors.

To address this issue, this library provides a `NonStandardKeyDescription` class that can read such structures. However, when creating extensions, it is recommended to use `KeyDescription`, as it guarantees the order of object fields according to the specification.

Here are simplified TypeScript examples:

Example of creating a `KeyDescription` object in TypeScript for the Android Keystore system

```typescript
const attestation = new android.AttestationApplicationId({
  packageInfos: [
    new android.AttestationPackageInfo({
      packageName: new OctetString(Buffer.from("123", "utf8")),
      version: 1,
    }),
  ],
  signatureDigests: [
    new OctetString(Buffer.from("123", "utf8")),
  ],
});

const keyDescription = new KeyDescription({
  attestationVersion: android.Version.v200,
  attestationSecurityLevel: android.SecurityLevel.software,
  keymasterVersion: 1,
  keymasterSecurityLevel: android.SecurityLevel.software,
  attestationChallenge: new OctetString(Buffer.from("123", "utf8")),
  uniqueId: new OctetString(Buffer.from("123", "utf8")),
  softwareEnforced: new android.AuthorizationList({
    creationDateTime: 1506793476000,
    attestationApplicationId: new OctetString(AsnConvert.serialize(attestation)),
  }),
  teeEnforced: new android.AuthorizationList({
    purpose: new android.IntegerSet([1]),
    algorithm: 1,
    keySize: 1,
    digest: new android.IntegerSet([1]),
    ecCurve: 1,
    userAuthType: 1,
    origin: 1,
    rollbackResistant: null,
  }),
});

const raw = AsnConvert.serialize(keyDescription);
```

Example of reading a `NonStandardKeyDescription` object in TypeScript

```typescript
const keyDescription = AsnConvert.parse(raw, NonStandardKeyDescription);

console.log(keyDescription.attestationVersion); // 100
console.log(keyDescription.attestationSecurityLevel); // 1
console.log(keyDescription.keymasterVersion); // 100
console.log(keyDescription.keymasterSecurityLevel); // 1
console.log(keyDescription.attestationChallenge.byteLength); // 32
console.log(keyDescription.uniqueId.byteLength); // 0
console.log(keyDescription.softwareEnforced.findProperty("attestationApplicationId")?.byteLength); // 81
console.log(keyDescription.teeEnforced.findProperty("attestationIdBrand")?.byteLength); // 8
```
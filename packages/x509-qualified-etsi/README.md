# `@peculiar/asn1-x509-qualified-etsi`

[![License](https://img.shields.io/badge/license-MIT-green.svg?style=flat)](https://raw.githubusercontent.com/PeculiarVentures/asn1-schema/master/packages/x509-qualified-etsi/LICENSE.md)
[![npm version](https://badge.fury.io/js/%40peculiar%2Fasn1-x509-qualified-etsi.svg)](https://badge.fury.io/js/%40peculiar%2Fasn1-x509-qualified-etsi)

[![NPM](https://nodei.co/npm/@peculiar/asn1-x509-qualified-etsi.png)](https://nodei.co/npm/@peculiar/asn1-x509-qualified-etsi/)

[ETSI EN 319 412-5 v2.3.1](https://www.etsi.org/deliver/etsi_en/319400_319499/31941205/02.03.01_60/en_31941205v020301p.pdf)

## Installation

```
npm install @peculiar/asn1-x509-qualified-etsi
```

## Usage

```js
import { AsnConvert } from "@peculiar/asn1-schema";
import * as etsi from "@peculiar/asn1-x509-qualified-etsi";

// Serialize
const qcCClegislation = new etsi.QcCClegislation(["UK", "FR"]);
const raw = AsnConvert.serialize(qcCClegislation);

console.log(Buffer.from(raw).toString("hex")); // 30081302554b13024652

// Parse
const qc = AsnConvert.parse(raw, etsi.QcCClegislation);
console.log(qc); // QcCClegislation(2) [ 'UK', 'FR' ]
```

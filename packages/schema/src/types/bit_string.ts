import { AsnNode, AsnNodeUtils, CompiledSchema } from "@peculiar/asn1-codec";
import { BufferSource, BufferSourceConverter } from "pvtsutils";
import { AsnNodeType, IAsnConvertible } from "../types";

export class BitString<T extends number = number> implements IAsnConvertible {
  public unusedBits = 0;

  public value = new ArrayBuffer(0);

  constructor();
  constructor(value: T);
  constructor(value: BufferSource, unusedBits?: number);
  constructor(params?: number | BufferSource, unusedBits = 0) {
    if (params) {
      if (typeof params === "number") {
        this.fromNumber(params as T);
      } else if (BufferSourceConverter.isBufferSource(params)) {
        this.unusedBits = unusedBits;
        this.value = BufferSourceConverter.toArrayBuffer(params);
      } else {
        throw TypeError("Unsupported type of 'params' argument for BitString");
      }
    }
  }

  public fromASN(asn: AsnNodeType): this {
    // Expect UNIVERSAL BIT STRING (class = 0, tag = 3)
    if (asn.node.tagClass !== 0 || asn.node.type !== 3) {
      throw new Error("Object's ASN.1 structure doesn't match BIT STRING");
    }

    const raw = asn.context.sliceValueRaw(asn.node);
    this.unusedBits = raw[0];
    this.value = raw.subarray(1);

    return this;
  }

  public toASN(): AsnNode {
    const node = AsnNodeUtils.makeNode();
    node.tagClass = 0; // UNIVERSAL
    node.type = 3; // BIT STRING
    node.constructed = false;

    // BIT STRING format: first byte is unused bits count, followed by data
    const data = new Uint8Array(this.value.byteLength + 1);
    data[0] = this.unusedBits; // unused bits count
    data.set(new Uint8Array(this.value), 1); // copy the actual data

    node.valueRaw = data;
    node.end = data.length;

    return node;
  }

  public toSchema(name: string): CompiledSchema {
    return {
      root: {
        id: -1,
        name,
        typeName: "BIT STRING",
        expectedTag: { cls: 0, tag: 3, constructed: false },
      },
      nodes: new Map(),
    };
  }

  public toNumber(): T {
    let res = "";
    const uintArray = new Uint8Array(this.value);
    for (const octet of uintArray) {
      res += octet.toString(2).padStart(8, "0");
    }
    res = res.split("").reverse().join(""); // reverse bits
    if (this.unusedBits) {
      // disable unused bits
      res = res.slice(this.unusedBits).padStart(this.unusedBits, "0");
    }
    return parseInt(res, 2) as T;
  }

  public fromNumber(value: T): void {
    let bits = value.toString(2);
    const octetSize = (bits.length + 7) >> 3;
    this.unusedBits = (octetSize << 3) - bits.length;
    const octets = new Uint8Array(octetSize);

    bits = bits
      .padStart(octetSize << 3, "0")
      .split("")
      .reverse()
      .join("");
    let index = 0;
    while (index < octetSize) {
      octets[index] = parseInt(bits.slice(index << 3, (index << 3) + 8), 2);
      index++;
    }

    this.value = octets.buffer;
  }
}

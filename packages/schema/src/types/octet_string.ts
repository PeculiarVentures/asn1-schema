import { AsnNode, AsnNodeUtils, CompiledSchema } from "@peculiar/asn1-codec";
import { BufferSource, BufferSourceConverter } from "pvtsutils";
import { AsnNodeType, IAsnConvertible } from "../types";

// Implement ArrayBufferView, cause ES5 doesn't allow to extend ArrayBuffer class

export class OctetString implements IAsnConvertible, ArrayBufferView {
  public buffer: ArrayBuffer;
  public get byteLength(): number {
    return this.buffer.byteLength;
  }
  public get byteOffset(): number {
    return 0;
  }

  constructor();
  constructor(byteLength: number);
  constructor(bytes: number[]);
  constructor(bytes: BufferSource);
  constructor(param?: BufferSource | number | number[]) {
    if (typeof param === "number") {
      this.buffer = new ArrayBuffer(param);
    } else {
      if (BufferSourceConverter.isBufferSource(param)) {
        this.buffer = BufferSourceConverter.toArrayBuffer(param);
      } else if (Array.isArray(param)) {
        this.buffer = new Uint8Array(param);
      } else {
        this.buffer = new ArrayBuffer(0);
      }
    }
  }

  public fromASN(asn: AsnNodeType): this {
    // Accept both universal OCTET STRING and context-specific IMPLICIT tagging
    const isUniversalOctetString = asn.node.tagClass === 0 && asn.node.type === 4;
    const isContextImplicit = asn.node.tagClass === 2; // context-specific, IMPLICIT assumed by schema
    if (!isUniversalOctetString && !isContextImplicit) {
      throw new Error("Object's ASN.1 structure doesn't match OCTET STRING");
    }
    // Slice raw value regardless of constructed flag (parser handles constructed/primitive)
    const bytes = asn.context.sliceValueRaw(asn.node);
    // Persist as ArrayBuffer for API compatibility
    this.buffer = bytes.buffer.slice(bytes.byteOffset, bytes.byteOffset + bytes.byteLength);
    return this;
  }

  public toASN(): AsnNode {
    const node = AsnNodeUtils.makeNode();
    node.tagClass = 0; // UNIVERSAL
    node.type = 4; // OCTET STRING
    node.constructed = false;
    node.valueRaw = new Uint8Array(this.buffer);
    node.end = node.valueRaw.length;
    return node;
  }

  public toSchema(name: string): CompiledSchema {
    return {
      root: {
        id: -1,
        name,
        typeName: "OCTET STRING",
        expectedTag: { cls: 0, tag: 4, constructed: false },
      },
      nodes: new Map(),
    };
  }
}

import { AsnNode } from "@peculiar/asn1-codec";
import { schemaStorage } from "./storage";
import { AsnPropTypes, AsnTypeTypes } from "./enums";
import { IAsnConvertible } from "./types";
import { AsnArray } from "./objects";
import { defaultConverter } from "./converters";

interface SchemaItem {
  defaultValue?: unknown;
  optional?: boolean;
  converter?: { toASN?: (value: unknown) => unknown };
  type: unknown;
  context?: number;
  implicit?: boolean;
  repeated?: "set" | "sequence" | string;
}

interface Schema {
  type: AsnTypeTypes;
  items: Record<string, SchemaItem>;
  itemType?: unknown; // Add itemType for AsnArray types
}

export class AsnSerializer {
  public static serialize(obj: unknown): ArrayBuffer {
    if (obj === null || obj === undefined) {
      // Return NULL ASN.1 structure
      return new Uint8Array([0x05, 0x00]).buffer;
    }

    // Check if obj has a schema
    const constructor = (obj as Record<string, unknown>).constructor as new () => unknown;
    if (!schemaStorage.has(constructor)) {
      // No schema, try basic serialization
      return this.serializeBasic(obj);
    }

    const schema = schemaStorage.get(constructor) as Schema;

    // Serialize based on schema type
    switch (schema.type) {
      case AsnTypeTypes.Sequence:
        return this.serializeSequence(obj as Record<string, unknown>, schema);
      case AsnTypeTypes.Set:
        return this.serializeSet(obj as Record<string, unknown>, schema);
      case AsnTypeTypes.Choice:
        return this.serializeChoice(obj as Record<string, unknown>, schema);
      default:
        throw new Error("Unsupported Asn1Type");
    }
  }

  private static serializeSequence(obj: Record<string, unknown>, schema: Schema): ArrayBuffer {
    const items: Uint8Array[] = [];

    // Check if this is an AsnArray (SEQUENCE OF or SET OF)
    if (obj instanceof AsnArray && schema.itemType) {
      // Serialize each array item using itemType
      for (const item of obj) {
        let serializedItem: ArrayBuffer;

        // Handle primitive types
        if (typeof schema.itemType === "number") {
          // Prefer default converter for primitive AsnPropTypes
          const conv = defaultConverter(schema.itemType as AsnPropTypes);
          if (conv && typeof conv.toASN === "function") {
            const asnValue = conv.toASN(item as unknown);
            if (asnValue instanceof ArrayBuffer) {
              serializedItem = asnValue;
            } else if (asnValue && typeof asnValue === "object" && "toBER" in asnValue) {
              serializedItem = (asnValue as { toBER: () => ArrayBuffer }).toBER();
            } else if (asnValue && typeof asnValue === "object" && "valueRaw" in asnValue) {
              const asnNode = asnValue as AsnNode;
              const tag = (asnNode.tagClass << 6) | asnNode.type;
              const content = asnNode.valueRaw || new Uint8Array(0);
              serializedItem = this.encodeTlv(tag, content).buffer;
            } else {
              // Fallback to primitive serializer mapping
              serializedItem = this.serializePrimitive(item, schema.itemType as number);
            }
          } else {
            // Fallback to primitive serializer mapping
            serializedItem = this.serializePrimitive(item, schema.itemType as number);
          }
        } else {
          // Handle complex types - recursive serialization
          serializedItem = this.serialize(item);
        }

        if (serializedItem) {
          items.push(new Uint8Array(serializedItem));
        }
      }
    } else {
      // Process each property according to schema (standard object serialization)
      for (const [propertyKey, itemSchema] of Object.entries(schema.items)) {
        const value = obj[propertyKey];

        // Skip properties with default values (deep-aware)
        if (itemSchema.defaultValue !== undefined) {
          if (this.isDefaultValue(value, itemSchema)) {
            continue;
          }
        }

        // Skip undefined optional properties
        if (value === undefined && itemSchema.optional) {
          continue;
        }

        // Serialize the property with context-specific handling
        const serializedItem = this.serializeProperty(value, itemSchema);
        if (serializedItem) {
          items.push(new Uint8Array(serializedItem));
        }
      }
    }

    // Calculate total length
    const totalLength = items.reduce((sum, item) => sum + item.length, 0);

    // Create SEQUENCE header
    const header = this.encodeTagLength(0x30, totalLength);

    // Combine header and content
    const result = new Uint8Array(header.length + totalLength);
    result.set(header, 0);
    let offset = header.length;

    for (const item of items) {
      result.set(item, offset);
      offset += item.length;
    }

    return result.buffer;
  }

  // Determine if a value equals the default for skipping during serialization
  private static isDefaultValue(value: unknown, itemSchema: SchemaItem): boolean {
    const def = itemSchema.defaultValue as unknown;
    if (def === undefined) return false;
    // Fast path for primitives
    if (typeof value !== "object" || value === null || typeof def !== "object" || def === null) {
      // For ArrayBuffers, compare bytes length 0 as a simple heuristic
      if (value instanceof ArrayBuffer && def instanceof ArrayBuffer) {
        if (value.byteLength !== def.byteLength) return false;
        const a = new Uint8Array(value);
        const b = new Uint8Array(def);
        if (a.byteLength !== b.byteLength) return false;
        for (let i = 0; i < a.byteLength; i++) if (a[i] !== b[i]) return false;
        return true;
      }
      return value === def;
    }

    // If the value has isEqual, use it
    // Use structural check for isEqual without using 'any'
    const valObj = value as { isEqual?: (other: unknown) => boolean };
    if (valObj && typeof valObj.isEqual === "function") {
      try {
        return !!valObj.isEqual(def);
      } catch {
        // fallthrough
      }
    }

    // Otherwise compare serialized encodings of both values
    try {
      const left = this.serialize(value);
      const right = this.serialize(def);
      const la = new Uint8Array(left);
      const ra = new Uint8Array(right);
      if (la.length !== ra.length) return false;
      for (let i = 0; i < la.length; i++) if (la[i] !== ra[i]) return false;
      return true;
    } catch {
      return false;
    }
  }

  private static serializeSet(obj: Record<string, unknown>, schema: Schema): ArrayBuffer {
    // For now, treat SET like SEQUENCE (same structure, different tag)
    const sequenceBuffer = this.serializeSequence(obj, schema);
    const sequenceData = new Uint8Array(sequenceBuffer);

    // Change tag from SEQUENCE (0x30) to SET (0x31)
    if (sequenceData.length > 0 && sequenceData[0] === 0x30) {
      sequenceData[0] = 0x31;
    }

    return sequenceData.buffer;
  }

  private static serializeChoice(obj: Record<string, unknown>, schema: Schema): ArrayBuffer {
    // For CHOICE, serialize the first non-undefined property
    let found = false;
    for (const [propertyKey, itemSchema] of Object.entries(schema.items)) {
      const value = obj[propertyKey];
      // null is a valid value for CHOICE (e.g., NULL)
      if (value !== undefined) {
        found = true;
        return this.serializeProperty(value, itemSchema) || new ArrayBuffer(0);
      }
    }
    if (!found) {
      throw new Error("CHOICE must have at least one selected value");
    }
    return new ArrayBuffer(0);
  }

  private static serializeProperty(value: unknown, itemSchema: SchemaItem): ArrayBuffer | null {
    if (value === undefined) {
      return null;
    }

    // Handle repeated properties (arrays) - only if itemSchema indicates this is a repeated field
    if (
      Array.isArray(value) &&
      (itemSchema.repeated === "set" || itemSchema.repeated === "sequence")
    ) {
      const items: Uint8Array[] = [];

      // Serialize each array element WITHOUT applying context/repeated again
      const elementSchema: SchemaItem = {
        ...itemSchema,
        repeated: undefined,
        context: undefined,
        implicit: undefined,
      } as SchemaItem;

      for (const item of value) {
        const serializedItem = this.serializeProperty(item, elementSchema);
        if (serializedItem) {
          items.push(new Uint8Array(serializedItem));
        }
      }

      // Combine all items
      if (items.length === 0) {
        // Return empty container with appropriate tag
        const tag = itemSchema.repeated === "set" ? 0x31 : 0x30; // SET or SEQUENCE
        return this.encodeTlv(tag, new Uint8Array(0)).buffer;
      }

      // Calculate total length
      const totalLength = items.reduce((sum, item) => sum + item.length, 0);
      const content = new Uint8Array(totalLength);
      let offset = 0;

      for (const item of items) {
        content.set(item, offset);
        offset += item.length;
      }

      // Wrap in appropriate container tag
      const tag = itemSchema.repeated === "set" ? 0x31 : 0x30; // SET or SEQUENCE
      const container = this.encodeTlv(tag, content);

      // Apply context-specific tag to the container if needed
      if (itemSchema.context !== null && itemSchema.context !== undefined) {
        return this.applyContextSpecificTag(container.buffer, itemSchema);
      }

      return container.buffer;
    }

    // First serialize the base value
    let baseBuffer: ArrayBuffer;

    // Handle objects with toASN method (like BitString)
    if (value && typeof value === "object" && "toASN" in value) {
      const asnNode = (value as IAsnConvertible).toASN();
      const tag = (asnNode.tagClass << 6) | (asnNode.constructed ? 0x20 : 0) | asnNode.type;
      const content = asnNode.valueRaw || new Uint8Array(0);
      baseBuffer = this.encodeTlv(tag, content).buffer;
    }
    // Use converter if available
    else if (itemSchema.converter && typeof itemSchema.converter.toASN === "function") {
      try {
        const asnValue = itemSchema.converter.toASN(value);
        if (asnValue instanceof ArrayBuffer) {
          baseBuffer = asnValue;
        } else if (asnValue && typeof asnValue === "object" && "toBER" in asnValue) {
          const ber = (asnValue as { toBER: () => ArrayBuffer }).toBER();
          baseBuffer = ber;
        } else if (asnValue && typeof asnValue === "object" && "valueRaw" in asnValue) {
          const asnNode = asnValue as AsnNode & { raw?: Uint8Array | null };
          // Prefer raw bytes if available to preserve constructed flag and children
          if (asnNode.raw && asnNode.raw.byteLength) {
            const raw = asnNode.raw;
            baseBuffer = raw.buffer.slice(raw.byteOffset, raw.byteOffset + raw.byteLength);
          } else {
            const tag = (asnNode.tagClass << 6) | (asnNode.constructed ? 0x20 : 0) | asnNode.type;
            const content = asnNode.valueRaw || new Uint8Array(0);
            baseBuffer = this.encodeTlv(tag, content).buffer;
          }
        } else {
          // If converter returned something else, fallback to basic serialization
          baseBuffer = this.serializeBasic(value);
        }
      } catch (error) {
        console.warn("Converter error:", error);
        baseBuffer = this.serializeBasic(value);
      }
    }
    // Handle different types
    else if (typeof itemSchema.type === "number") {
      baseBuffer = this.serializePrimitive(value, itemSchema.type);
    } else {
      // Complex type - recursive serialization
      baseBuffer = this.serialize(value);
    }

    // Now handle context-specific tagging if needed
    if (itemSchema.context !== null && itemSchema.context !== undefined) {
      return this.applyContextSpecificTag(baseBuffer, itemSchema);
    }

    return baseBuffer;
  }

  private static applyContextSpecificTag(
    baseBuffer: ArrayBuffer,
    itemSchema: SchemaItem,
  ): ArrayBuffer {
    const baseData = new Uint8Array(baseBuffer);
    const contextTag = itemSchema.context!;

    // Helpers for tag encoding
    const encodeTagBytes = (cls: number, constructed: boolean, tagNumber: number): Uint8Array => {
      const firstOctetBase = (cls << 6) | (constructed ? 0x20 : 0x00);
      if (tagNumber < 31) {
        return new Uint8Array([firstOctetBase | tagNumber]);
      }
      // long-form tag number
      const octets: number[] = [firstOctetBase | 0x1f];
      const stack: number[] = [];
      let n = tagNumber >>> 0; // ensure number
      while (n > 0) {
        stack.unshift(n & 0x7f);
        n = Math.floor(n / 128);
      }
      for (let i = 0; i < stack.length; i++) {
        const b = stack[i] | (i === stack.length - 1 ? 0x00 : 0x80);
        octets.push(b);
      }
      return new Uint8Array(octets);
    };

    const encodeLengthBytes = (length: number): Uint8Array => {
      if (length < 0x80) return new Uint8Array([length]);
      const len: number[] = [];
      let tmp = length;
      while (tmp > 0) {
        len.unshift(tmp & 0xff);
        tmp = Math.floor(tmp / 256);
      }
      return new Uint8Array([0x80 | len.length, ...len]);
    };

    const replaceImplicitTag = (data: Uint8Array, newTagBytes: Uint8Array): ArrayBuffer => {
      if (data.length === 0) return data.buffer;
      // detect original tag length
      let idx = 1;
      if ((data[0] & 0x1f) === 0x1f) {
        // long-form tag number, skip base-128 bytes
        while (idx < data.length && data[idx] & 0x80) idx++;
        idx++; // include last tag byte
      }
      // splice: newTagBytes + rest (length+content)
      const out = new Uint8Array(newTagBytes.length + (data.length - idx));
      out.set(newTagBytes, 0);
      out.set(data.subarray(idx), newTagBytes.length);
      return out.buffer;
    };

    if (itemSchema.implicit) {
      // IMPLICIT tagging: replace the original tag with context-specific tag
      const isConstructed = baseData.length ? (baseData[0] & 0x20) !== 0 : false;
      const tagBytes = encodeTagBytes(2, isConstructed, contextTag);
      return replaceImplicitTag(baseData, tagBytes);
    } else {
      // EXPLICIT tagging: wrap the entire original encoding with context-specific tag
      const tagBytes = encodeTagBytes(2, true, contextTag); // Context-specific, constructed
      const lenBytes = encodeLengthBytes(baseData.length);
      const result = new Uint8Array(tagBytes.length + lenBytes.length + baseData.length);
      result.set(tagBytes, 0);
      result.set(lenBytes, tagBytes.length);
      result.set(baseData, tagBytes.length + lenBytes.length);
      return result.buffer;
    }
  }

  private static serializePrimitive(value: unknown, type: number): ArrayBuffer {
    switch (type as AsnPropTypes) {
      case AsnPropTypes.Integer:
        return this.serializeInteger(value as number);
      case AsnPropTypes.BitString:
        return this.serializeBitString(value as ArrayBuffer | Uint8Array);
      case AsnPropTypes.Utf8String:
        return this.serializeUtf8String(value as string);
      case AsnPropTypes.PrintableString:
        return this.serializePrintableString(value as string);
      case AsnPropTypes.IA5String:
        return this.serializeIA5String(value as string);
      case AsnPropTypes.OctetString:
        return this.serializeOctetString(value);
      case AsnPropTypes.ObjectIdentifier:
        return this.serializeObjectIdentifier(value as string);
      case AsnPropTypes.Boolean:
        return this.serializeBoolean(value as boolean);
      default:
        // Fallback to OCTET STRING for unsupported primitives
        return this.serializeOctetString(value);
    }
  }

  private static serializeInteger(value: number): ArrayBuffer {
    if (typeof value !== "number") {
      value = parseInt(String(value), 10) || 0;
    }

    // Convert number to bytes
    const bytes: number[] = [];
    if (value === 0) {
      bytes.push(0);
    } else {
      let temp = Math.abs(value);
      while (temp > 0) {
        bytes.unshift(temp & 0xff);
        temp = Math.floor(temp / 256);
      }

      // Handle negative numbers (two's complement)
      if (value < 0) {
        // Simple negative number handling
        for (let i = 0; i < bytes.length; i++) {
          bytes[i] = ~bytes[i] & 0xff;
        }
        let carry = 1;
        for (let i = bytes.length - 1; i >= 0 && carry; i--) {
          bytes[i] += carry;
          if (bytes[i] > 255) {
            bytes[i] &= 0xff;
            carry = 1;
          } else {
            carry = 0;
          }
        }
      }
    }

    const content = new Uint8Array(bytes);
    const header = this.encodeTagLength(0x02, content.length);

    const result = new Uint8Array(header.length + content.length);
    result.set(header, 0);
    result.set(content, header.length);

    return result.buffer;
  }

  private static serializeUtf8String(value: string): ArrayBuffer {
    const content = new TextEncoder().encode(String(value));
    const header = this.encodeTagLength(0x0c, content.length);

    const result = new Uint8Array(header.length + content.length);
    result.set(header, 0);
    result.set(content, header.length);

    return result.buffer;
  }

  private static serializeBitString(value: ArrayBuffer | Uint8Array): ArrayBuffer {
    const bytes = value instanceof Uint8Array ? value : new Uint8Array(value);
    // Prepend 0 unused bits byte
    const content = new Uint8Array(bytes.length + 1);
    content[0] = 0; // unused bits
    content.set(bytes, 1);
    const header = this.encodeTagLength(0x03, content.length);
    const result = new Uint8Array(header.length + content.length);
    result.set(header, 0);
    result.set(content, header.length);
    return result.buffer;
  }

  private static serializePrintableString(value: string): ArrayBuffer {
    const content = new TextEncoder().encode(String(value));
    const header = this.encodeTagLength(0x13, content.length);

    const result = new Uint8Array(header.length + content.length);
    result.set(header, 0);
    result.set(content, header.length);

    return result.buffer;
  }

  private static serializeIA5String(value: string): ArrayBuffer {
    const content = new TextEncoder().encode(String(value));
    const header = this.encodeTagLength(0x16, content.length);

    const result = new Uint8Array(header.length + content.length);
    result.set(header, 0);
    result.set(content, header.length);

    return result.buffer;
  }

  private static serializeOctetString(value: unknown): ArrayBuffer {
    let content: Uint8Array;

    if (value instanceof ArrayBuffer) {
      content = new Uint8Array(value);
    } else if (value instanceof Uint8Array) {
      content = value;
    } else if (typeof value === "string") {
      content = new TextEncoder().encode(value);
    } else {
      content = new Uint8Array(0);
    }

    const header = this.encodeTagLength(0x04, content.length);

    const result = new Uint8Array(header.length + content.length);
    result.set(header, 0);
    result.set(content, header.length);

    return result.buffer;
  }

  private static serializeBoolean(value: boolean): ArrayBuffer {
    const content = new Uint8Array([value ? 0xff : 0x00]);
    const header = this.encodeTagLength(0x01, 1);

    const result = new Uint8Array(header.length + 1);
    result.set(header, 0);
    result.set(content, header.length);

    return result.buffer;
  }

  private static serializeObjectIdentifier(value: string): ArrayBuffer {
    // Encode OID per X.690
    const parts = value.split(".").map((v) => parseInt(v, 10));
    if (parts.length < 2) {
      throw new Error("Invalid OID");
    }
    const first = parts[0] * 40 + parts[1];
    const body: number[] = [];
    const encodeBase128 = (n: number) => {
      const stack: number[] = [];
      do {
        stack.unshift(n & 0x7f);
        n = n >>> 7;
      } while (n > 0);
      for (let i = 0; i < stack.length; i++) {
        const v = stack[i] | (i === stack.length - 1 ? 0x00 : 0x80);
        body.push(v);
      }
    };
    encodeBase128(first);
    for (let i = 2; i < parts.length; i++) {
      encodeBase128(parts[i]);
    }
    const content = new Uint8Array(body);
    const header = this.encodeTagLength(0x06, content.length);
    const result = new Uint8Array(header.length + content.length);
    result.set(header, 0);
    result.set(content, header.length);
    return result.buffer;
  }

  private static serializeBasic(obj: unknown): ArrayBuffer {
    // Handle objects with toASN method
    if (obj && typeof obj === "object" && "toASN" in obj) {
      const asnNode = (obj as IAsnConvertible).toASN();
      const tag = (asnNode.tagClass << 6) | (asnNode.constructed ? 0x20 : 0) | asnNode.type;
      const content = asnNode.valueRaw || new Uint8Array(0);
      return this.encodeTlv(tag, content).buffer;
    }

    // Handle plain AsnNode objects coming from converter.toASN
    if (
      obj &&
      typeof obj === "object" &&
      "tagClass" in (obj as Record<string, unknown>) &&
      "type" in (obj as Record<string, unknown>)
    ) {
      const node = obj as unknown as AsnNode & { raw?: Uint8Array | null };
      // Prefer raw bytes if available
      if (node.raw && node.raw.byteLength) {
        const raw = node.raw;
        return raw.buffer.slice(raw.byteOffset, raw.byteOffset + raw.byteLength);
      }
      const tag = (node.tagClass << 6) | (node.constructed ? 0x20 : 0) | node.type;
      const content = node.valueRaw || new Uint8Array(0);
      return this.encodeTlv(tag, content).buffer;
    }

    // Handle ArrayBuffer as OCTET STRING
    if (obj instanceof ArrayBuffer) {
      return this.serializeOctetString(obj);
    }
    if (obj instanceof Uint8Array) {
      return this.serializeOctetString(
        obj.buffer.slice(obj.byteOffset, obj.byteOffset + obj.byteLength),
      );
    }

    // Fallback for objects without schema
    if (obj === null || obj === undefined) {
      return new Uint8Array([0x05, 0x00]).buffer; // NULL
    }

    if (typeof obj === "number") {
      return this.serializeInteger(obj);
    }

    if (typeof obj === "string") {
      return this.serializeUtf8String(obj);
    }

    if (typeof obj === "boolean") {
      return this.serializeBoolean(obj);
    }

    // Default: empty SEQUENCE
    return new Uint8Array([0x30, 0x00]).buffer;
  }

  private static encodeTagLength(tag: number, length: number): Uint8Array {
    if (length < 0x80) {
      // Short form
      return new Uint8Array([tag, length]);
    } else {
      // Long form
      const lengthBytes: number[] = [];
      let temp = length;
      while (temp > 0) {
        lengthBytes.unshift(temp & 0xff);
        temp = Math.floor(temp / 256);
      }

      const result = new Uint8Array(2 + lengthBytes.length);
      result[0] = tag;
      result[1] = 0x80 | lengthBytes.length;
      for (let i = 0; i < lengthBytes.length; i++) {
        result[2 + i] = lengthBytes[i];
      }

      return result;
    }
  }

  private static encodeTlv(tag: number, content: Uint8Array): Uint8Array {
    const header = this.encodeTagLength(tag, content.length);
    const result = new Uint8Array(header.length + content.length);
    result.set(header, 0);
    result.set(content, header.length);
    return result;
  }
}

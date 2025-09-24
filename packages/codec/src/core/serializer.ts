import { AsnNode, SerializeOptions, SerializeContext, CompiledSchema, AsnTag } from "../types";
import { TlvEncoder, AsnBuffer } from "./encoder";
import { PrimitiveEncoders } from "../encoders/primitives";
import { StringEncoders } from "../encoders/strings";
import { TimeEncoders } from "../encoders/time";

/**
 * High-performance ASN.1 serializer with two operation modes:
 * 1. Serialize materialized objects back to ASN.1 structures
 * 2. Serialize to DER/BER byte arrays
 */
export class AsnSerializer {
  /**
   * Serialize materialized object to ASN.1 node structure
   * (reverse of materialize operation)
   */
  static serialize(data: unknown, schema?: CompiledSchema, options?: SerializeOptions): AsnNode {
    const ctx: SerializeContext = {
      schema,
      derMode: options?.derMode ?? true,
      validateInput: options?.validateInput ?? true,
    };

    return this.serializeValue(data, ctx, schema?.root);
  }

  /**
   * Serialize materialized object directly to bytes
   */
  static serializeToBytes(
    data: unknown,
    schema?: CompiledSchema,
    options?: SerializeOptions,
  ): Uint8Array {
    const node = this.serialize(data, schema, options);
    return this.nodeToBytes(node);
  }

  /**
   * Serialize ASN.1 node structure to bytes
   */
  static nodeToBytes(node: AsnNode): Uint8Array {
    const buffer = new AsnBuffer();
    this.serializeNodeToBuffer(node, buffer);
    return buffer.toUint8Array();
  }

  /**
   * Internal: serialize value to ASN.1 node
   */
  private static serializeValue(value: unknown, ctx: SerializeContext, schemaNode?: any): AsnNode {
    // Use schema information if available
    if (schemaNode) {
      return this.serializeWithSchema(value, ctx, schemaNode);
    }

    // Auto-detect type based on value
    return this.serializeAutoDetect(value, ctx);
  }

  /**
   * Serialize with schema guidance
   */
  private static serializeWithSchema(
    value: unknown,
    ctx: SerializeContext,
    schemaNode: any,
  ): AsnNode {
    const tag = schemaNode.expectedTag || {
      cls: 0,
      tag: 16,
      constructed: true,
    };

    switch (schemaNode.typeName) {
      case "INTEGER":
        return this.createPrimitiveNode(
          tag,
          PrimitiveEncoders.encodeInteger(value as number | bigint),
        );

      case "ENUMERATED":
        return this.createPrimitiveNode(
          tag,
          PrimitiveEncoders.encodeInteger(value as number | bigint),
        );

      case "BOOLEAN":
        return this.createPrimitiveNode(tag, PrimitiveEncoders.encodeBoolean(value as boolean));

      case "NULL":
        return this.createPrimitiveNode(tag, PrimitiveEncoders.encodeNull());

      case "OCTET STRING":
        return this.createPrimitiveNode(
          tag,
          PrimitiveEncoders.encodeOctetString(value as Uint8Array),
        );

      case "BIT STRING": {
        // Handle different input formats for BIT STRING
        let bitStringValue: { unusedBits: number; bytes: Uint8Array };

        if (value && typeof value === "object" && "unusedBits" in value && "bytes" in value) {
          // Already in correct format
          bitStringValue = value as { unusedBits: number; bytes: Uint8Array };
        } else if (value instanceof ArrayBuffer) {
          // Convert ArrayBuffer to BIT STRING format with 0 unused bits
          bitStringValue = {
            unusedBits: 0,
            bytes: new Uint8Array(value),
          };
        } else if (value instanceof Uint8Array) {
          // Convert Uint8Array to BIT STRING format with 0 unused bits
          bitStringValue = {
            unusedBits: 0,
            bytes: value,
          };
        } else {
          throw new Error(
            "BIT STRING value must be ArrayBuffer, Uint8Array, or {unusedBits, bytes}",
          );
        }

        return this.createPrimitiveNode(tag, PrimitiveEncoders.encodeBitString(bitStringValue));
      }

      case "OBJECT IDENTIFIER":
        return this.createPrimitiveNode(
          tag,
          PrimitiveEncoders.encodeObjectIdentifier(value as string),
        );

      case "UTF8 STRING":
        return this.createPrimitiveNode(tag, StringEncoders.encodeUtf8String(value as string));

      case "PRINTABLE STRING":
        return this.createPrimitiveNode(tag, StringEncoders.encodePrintableString(value as string));

      case "IA5 STRING":
        return this.createPrimitiveNode(tag, StringEncoders.encodeIa5String(value as string));

      case "BMP STRING":
        return this.createPrimitiveNode(tag, StringEncoders.encodeBmpString(value as string));

      case "UNIVERSAL STRING":
        return this.createPrimitiveNode(tag, StringEncoders.encodeUniversalString(value as string));

      case "NUMERIC STRING":
        return this.createPrimitiveNode(tag, StringEncoders.encodeNumericString(value as string));

      case "TELETEX STRING":
        return this.createPrimitiveNode(tag, StringEncoders.encodeTeletexString(value as string));

      case "VIDEOTEX STRING":
        return this.createPrimitiveNode(tag, StringEncoders.encodeTeletexString(value as string));

      case "GRAPHIC STRING":
        return this.createPrimitiveNode(tag, StringEncoders.encodeGeneralString(value as string));

      case "VISIBLE STRING":
        return this.createPrimitiveNode(tag, StringEncoders.encodeVisibleString(value as string));

      case "GENERAL STRING":
        return this.createPrimitiveNode(tag, StringEncoders.encodeGeneralString(value as string));

      case "CHARACTER STRING":
        return this.createPrimitiveNode(tag, StringEncoders.encodeCharacterString(value as string));

      case "UTCTIME": {
        const utcNode = this.createPrimitiveNode(tag, TimeEncoders.encodeUtcTime(value as Date));
        utcNode.decoded = value;
        return utcNode;
      }

      case "GENERALIZED TIME": {
        const genNode = this.createPrimitiveNode(
          tag,
          TimeEncoders.encodeGeneralizedTime(value as Date),
        );
        genNode.decoded = value;
        return genNode;
      }

      case "SEQUENCE":
      case "SET":
        return this.serializeConstructed(value, ctx, schemaNode, tag);

      case "SEQUENCE OF":
        return this.serializeSequenceOf(value, ctx, schemaNode, tag);

      case "CHOICE":
        return this.serializeChoice(value, ctx, schemaNode);

      default:
        throw new Error(`Unsupported schema type: ${schemaNode.typeName}`);
    }
  }

  /**
   * Auto-detect and serialize value
   */
  private static serializeAutoDetect(value: unknown, ctx: SerializeContext): AsnNode {
    // Handle null and undefined as ASN.1 NULL
    if (value === null || value === undefined) {
      return {
        tagClass: 0,
        type: 5, // ASN.1 NULL tag
        constructed: false,
        start: 0,
        headerEnd: 0,
        end: 0,
        children: null,
        schemaId: -1,
        fieldName: null,
        typeName: "NULL",
        valueRaw: new Uint8Array([]),
        raw: null,
        decoded: null,
      };
    }

    // Check for unsupported types
    if (typeof value === "symbol" || typeof value === "function") {
      throw new Error(`Cannot serialize value of type ${typeof value}`);
    }

    if (
      value instanceof Map ||
      value instanceof Set ||
      value instanceof WeakMap ||
      value instanceof WeakSet
    ) {
      throw new Error(`Cannot serialize ${value.constructor.name} objects`);
    }

    // Primitive types
    if (typeof value === "boolean") {
      const tag: AsnTag = { cls: 0, tag: 1, constructed: false };
      return this.createPrimitiveNode(tag, PrimitiveEncoders.encodeBoolean(value));
    }

    if (typeof value === "number" || typeof value === "bigint") {
      const tag: AsnTag = { cls: 0, tag: 2, constructed: false };
      return this.createPrimitiveNode(tag, PrimitiveEncoders.encodeInteger(value));
    }

    if (typeof value === "string") {
      const { tag, content } = StringEncoders.encodeAutoString(value);
      return this.createPrimitiveNode(tag, content);
    }

    if (value instanceof Date) {
      const { tag, content } = TimeEncoders.encodeAutoTime(value);
      return this.createPrimitiveNode(tag, content);
    }

    if (value instanceof Uint8Array) {
      const tag: AsnTag = { cls: 0, tag: 4, constructed: false };
      return this.createPrimitiveNode(tag, PrimitiveEncoders.encodeOctetString(value));
    }

    // Arrays (SEQUENCE OF) - must come before general object check
    if (Array.isArray(value)) {
      const tag: AsnTag = { cls: 0, tag: 16, constructed: true };
      return this.serializeArray(value, ctx, tag);
    }

    // Special object types (must be before general object check)
    if (typeof value === "object") {
      // Check for BitString-like objects
      if ("unusedBits" in value && "bytes" in value) {
        const bitString = value as { unusedBits: number; bytes: Uint8Array };
        if (bitString.unusedBits < 0 || bitString.unusedBits > 7) {
          throw new Error("unusedBits must be between 0 and 7");
        }
        const tag: AsnTag = { cls: 0, tag: 3, constructed: false };
        return this.createPrimitiveNode(tag, PrimitiveEncoders.encodeBitString(bitString));
      }

      // Check for OID-like objects
      if ("type" in value && (value as any).type === "oid") {
        const oidObj = value as { type: string; value: string };
        if (!oidObj.value || typeof oidObj.value !== "string") {
          throw new Error("Invalid OID: value must be a non-empty string");
        }
        const components = oidObj.value.split(".");
        if (components.length < 2) {
          throw new Error("Invalid OID: must have at least 2 components");
        }
        for (const comp of components) {
          if (!/^\d+$/.test(comp)) {
            throw new Error(`Invalid OID component: ${comp}`);
          }
        }
        const tag: AsnTag = { cls: 0, tag: 6, constructed: false };
        return this.createPrimitiveNode(
          tag,
          PrimitiveEncoders.encodeObjectIdentifier(oidObj.value),
        );
      }

      // General objects (SEQUENCE)
      const tag: AsnTag = { cls: 0, tag: 16, constructed: true };
      return this.serializeObject(value as Record<string, unknown>, ctx, tag);
    }

    throw new Error(`Cannot serialize value of type ${typeof value}`);
  }

  /**
   * Serialize constructed type (SEQUENCE/SET)
   */
  private static serializeConstructed(
    value: unknown,
    ctx: SerializeContext,
    schemaNode: any,
    tag: AsnTag,
  ): AsnNode {
    if (typeof value !== "object" || value === null) {
      throw new Error("Expected object for SEQUENCE/SET");
    }

    const obj = value as Record<string, unknown>;
    const children: AsnNode[] = [];

    // Process schema children in order
    if (schemaNode.children) {
      for (const childSchema of schemaNode.children) {
        const fieldName = childSchema.name;
        const fieldValue = obj[fieldName];

        // Handle optional fields
        if (fieldValue === undefined) {
          if (!childSchema.optional) {
            throw new Error(`Required field '${fieldName}' is missing`);
          }
          continue;
        }

        const childNode = this.serializeValue(fieldValue, ctx, childSchema);
        childNode.fieldName = fieldName;
        children.push(childNode);
      }
    }

    return this.createConstructedNode(tag, children);
  }

  /**
   * Serialize SEQUENCE OF
   */
  private static serializeSequenceOf(
    value: unknown,
    ctx: SerializeContext,
    schemaNode: any,
    tag: AsnTag,
  ): AsnNode {
    if (!Array.isArray(value)) {
      throw new Error("Expected array for SEQUENCE OF");
    }

    const children: AsnNode[] = [];
    const itemSchema = schemaNode.children?.[0];

    for (const item of value) {
      const childNode = this.serializeValue(item, ctx, itemSchema);
      children.push(childNode);
    }

    const node = this.createConstructedNode(tag, children);
    node.isSequenceOf = true;
    return node;
  }

  /**
   * Serialize CHOICE
   */
  private static serializeChoice(value: unknown, ctx: SerializeContext, schemaNode: any): AsnNode {
    if (typeof value !== "object" || value === null) {
      throw new Error("Expected object for CHOICE");
    }

    const obj = value as Record<string, unknown>;
    const keys = Object.keys(obj);

    if (keys.length !== 1) {
      throw new Error("CHOICE must have exactly one field");
    }

    const choiceKey = keys[0];
    const choiceValue = obj[choiceKey];

    // Find matching choice in schema
    const choiceSchema = schemaNode.children?.find((child: any) => child.name === choiceKey);

    if (!choiceSchema) {
      throw new Error(`Unknown choice: ${choiceKey}`);
    }

    return this.serializeValue(choiceValue, ctx, choiceSchema);
  }

  /**
   * Serialize array (auto-detected)
   */
  private static serializeArray(value: unknown[], ctx: SerializeContext, tag: AsnTag): AsnNode {
    const children: AsnNode[] = [];

    for (const item of value) {
      const childNode = this.serializeValue(item, ctx);
      children.push(childNode);
    }

    const node = this.createConstructedNode(tag, children);
    node.isSequenceOf = true;
    return node;
  }

  /**
   * Serialize object (auto-detected)
   */
  private static serializeObject(
    value: Record<string, unknown>,
    ctx: SerializeContext,
    tag: AsnTag,
  ): AsnNode {
    const children: AsnNode[] = [];

    for (const [key, val] of Object.entries(value)) {
      // Skip raw data fields
      if (key === "_raw" || key === "_valueRaw" || key === "decoded") {
        continue;
      }

      const childNode = this.serializeValue(val, ctx);
      childNode.fieldName = key;
      children.push(childNode);
    }

    return this.createConstructedNode(tag, children);
  }

  /**
   * Create primitive ASN.1 node
   */
  private static createPrimitiveNode(tag: AsnTag, content: Uint8Array): AsnNode {
    return {
      tagClass: tag.cls,
      type: tag.tag,
      constructed: false,
      start: 0,
      headerEnd: 0,
      end: content.length,
      children: null,
      schemaId: -1,
      fieldName: null,
      typeName: null,
      valueRaw: content,
      raw: null,
      decoded: null,
    };
  }

  /**
   * Create constructed ASN.1 node
   */
  private static createConstructedNode(tag: AsnTag, children: AsnNode[]): AsnNode {
    return {
      tagClass: tag.cls,
      type: tag.tag,
      constructed: true,
      start: 0,
      headerEnd: 0,
      end: 0, // Will be calculated during encoding
      children,
      schemaId: -1,
      fieldName: null,
      typeName: null,
      valueRaw: null,
      raw: null,
      decoded: null,
    };
  }

  /**
   * Create NULL node
   */
  private static createNullNode(): AsnNode {
    const tag: AsnTag = { cls: 0, tag: 5, constructed: false };
    return this.createPrimitiveNode(tag, PrimitiveEncoders.encodeNull());
  }

  /**
   * Serialize node to buffer (recursive)
   */
  private static serializeNodeToBuffer(node: AsnNode, buffer: AsnBuffer): void {
    const tag: AsnTag = {
      cls: node.tagClass,
      tag: node.type,
      constructed: node.constructed,
    };

    if (node.constructed && node.children) {
      // Serialize children first to calculate content length
      const contentBuffer = new AsnBuffer();
      for (const child of node.children) {
        this.serializeNodeToBuffer(child, contentBuffer);
      }

      const content = contentBuffer.toUint8Array();
      const tlv = TlvEncoder.encodeTlv(tag, content);
      buffer.append(tlv);
    } else {
      // Primitive type
      const content = node.valueRaw || new Uint8Array(0);
      const tlv = TlvEncoder.encodeTlv(tag, content);
      buffer.append(tlv);
    }
  }
}

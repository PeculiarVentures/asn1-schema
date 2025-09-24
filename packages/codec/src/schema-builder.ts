import { AsnDecoders } from "./decoders";
import { AsnNode, CompiledSchema, CompiledSchemaNode } from "./types";

/**
 * Schema builder utilities
 */
export class SchemaBuilder {
  private nodeId = 0;
  private nodes = new Map<number, CompiledSchemaNode>();

  /**
   * Create a new schema node
   */
  createNode(config: {
    name: string;
    typeName: string;
    expectedTag?: { cls: number; tag: number; constructed?: boolean };
    tagging?: "implicit" | "explicit" | null;
    optional?: boolean;
    default?: unknown;
    isChoice?: boolean;
    decoder?: (node: AsnNode) => unknown;
    children?: CompiledSchemaNode[];
  }): CompiledSchemaNode {
    const id = this.nodeId++;
    const node: CompiledSchemaNode = {
      id,
      name: config.name,
      typeName: config.typeName,
      expectedTag: config.expectedTag,
      tagging: config.tagging,
      optional: config.optional,
      default: config.default,
      isChoice: config.isChoice,
      decoder: config.decoder as CompiledSchemaNode["decoder"],
      children: config.children,
    };

    this.nodes.set(id, node);
    return node;
  }

  /**
   * Get all nodes
   */
  getNodes(): Map<number, CompiledSchemaNode> {
    return new Map(this.nodes);
  }

  /**
   * Build the final schema
   */
  build(root: CompiledSchemaNode): CompiledSchema {
    return {
      root,
      nodes: new Map(this.nodes),
    };
  }
}

/**
 * AlgorithmIdentifier ::= SEQUENCE {
 *     algorithm               OBJECT IDENTIFIER,
 *     parameters              ANY DEFINED BY algorithm OPTIONAL  }
 */
export function createAlgorithmIdentifier(builder: SchemaBuilder): CompiledSchemaNode {
  return builder.createNode({
    name: "algorithmIdentifier",
    typeName: "AlgorithmIdentifier",
    expectedTag: { cls: 0, tag: 16, constructed: true },
    children: [
      builder.createNode({
        name: "algorithm",
        typeName: "OBJECT IDENTIFIER",
        expectedTag: { cls: 0, tag: 6, constructed: false },
        decoder: AsnDecoders.decodeObjectIdentifier,
      }),
      builder.createNode({
        name: "parameters",
        typeName: "ANY",
        optional: true,
        // No expected tag - can be anything
      }),
    ],
  });
}

/**
 * Time ::= CHOICE {
 *      utcTime        UTCTime,
 *      generalTime    GeneralizedTime }
 */
export function createTime(
  builder: SchemaBuilder,
  name: string = "time",
  optional: boolean = false,
): CompiledSchemaNode {
  return builder.createNode({
    name,
    typeName: "Time",
    isChoice: true,
    optional,
    children: [
      builder.createNode({
        name: "utcTime",
        typeName: "UTCTime",
        expectedTag: { cls: 0, tag: 23, constructed: false },
        decoder: AsnDecoders.decodeUtcTime,
      }),
      builder.createNode({
        name: "generalizedTime",
        typeName: "GeneralizedTime",
        expectedTag: { cls: 0, tag: 24, constructed: false },
        decoder: AsnDecoders.decodeGeneralizedTime,
      }),
    ],
  });
}

/**
 * Extensions ::= SEQUENCE SIZE (1..MAX) OF Extension
 *
 * Extension  ::=  SEQUENCE  {
 *      extnID      OBJECT IDENTIFIER,
 *      critical    BOOLEAN DEFAULT FALSE,
 *      extnValue   OCTET STRING
 *                  -- contains the DER encoding of an ASN.1 value
 *                  -- corresponding to the extension type identified
 *                  -- by extnID
 *      }
 */

/**
 * Single Extension schema
 */
export function createExtension(builder: SchemaBuilder): CompiledSchemaNode {
  return builder.createNode({
    name: "extension",
    typeName: "Extension",
    expectedTag: { cls: 0, tag: 16, constructed: true },
    children: [
      builder.createNode({
        name: "extnID",
        typeName: "OBJECT IDENTIFIER",
        expectedTag: { cls: 0, tag: 6, constructed: false },
      }),
      builder.createNode({
        name: "critical",
        typeName: "BOOLEAN",
        expectedTag: { cls: 0, tag: 1, constructed: false },
        optional: true,
        default: false,
      }),
      builder.createNode({
        name: "extnValue",
        typeName: "OCTET STRING",
        expectedTag: { cls: 0, tag: 4, constructed: false },
      }),
    ],
  });
}

export function createExtensions(builder: SchemaBuilder): CompiledSchemaNode {
  return builder.createNode({
    name: "extensions",
    typeName: "Extensions",
    expectedTag: { cls: 0, tag: 16, constructed: true },
    children: [createExtension(builder)],
  });
}

/**
 * Name ::= CHOICE { -- only one possibility for now --
 *   rdnSequence  RDNSequence }
 *
 * RDNSequence ::= SEQUENCE OF RelativeDistinguishedName
 *
 * RelativeDistinguishedName ::=
 *   SET SIZE (1..MAX) OF AttributeTypeAndValue
 *
 * AttributeTypeAndValue ::= SEQUENCE {
 *   type     AttributeType,
 *   value    AttributeValue }
 *
 * AttributeType ::= OBJECT IDENTIFIER
 *
 * AttributeValue ::= ANY -- DEFINED BY AttributeType
 */
export function createName(builder: SchemaBuilder, name: string = "name"): CompiledSchemaNode {
  // Simplified definition - Name as SEQUENCE OF RDN
  return builder.createNode({
    name,
    typeName: "SEQUENCE OF RelativeDistinguishedName",
    expectedTag: { cls: 0, tag: 16, constructed: true }, // SEQUENCE OF
    children: [
      builder.createNode({
        name: "rdn",
        typeName: "RelativeDistinguishedName",
        expectedTag: { cls: 0, tag: 17, constructed: true }, // SET
        children: [
          builder.createNode({
            name: "attributeTypeAndValue",
            typeName: "AttributeTypeAndValue",
            expectedTag: { cls: 0, tag: 16, constructed: true }, // SEQUENCE
            children: [
              builder.createNode({
                name: "type",
                typeName: "OBJECT IDENTIFIER",
                expectedTag: { cls: 0, tag: 6, constructed: false },
                decoder: AsnDecoders.decodeObjectIdentifier,
              }),
              builder.createNode({
                name: "value",
                typeName: "ANY",
                // ANY according to RFC 5280 - can be any type depending on OID
              }),
            ],
          }),
        ],
      }),
    ],
  });
}

/**
 * DirectoryString ::= CHOICE {
 *     printableString     PrintableString,
 *     utf8String          UTF8String,
 *     bmpString           BMPString
 * }
 */
export function createDirectoryString(
  builder: SchemaBuilder,
  name: string = "directoryString",
): CompiledSchemaNode {
  return builder.createNode({
    name,
    typeName: "DirectoryString",
    isChoice: true,
    children: [
      builder.createNode({
        name: "printableString",
        typeName: "PrintableString",
        expectedTag: { cls: 0, tag: 19, constructed: false },
        decoder: AsnDecoders.decodePrintableString,
      }),
      builder.createNode({
        name: "utf8String",
        typeName: "UTF8String",
        expectedTag: { cls: 0, tag: 12, constructed: false },
        decoder: AsnDecoders.decodeUtf8String,
      }),
      builder.createNode({
        name: "bmpString",
        typeName: "BMPString",
        expectedTag: { cls: 0, tag: 30, constructed: false },
        decoder: AsnDecoders.decodeBmpString,
      }),
    ],
  });
}

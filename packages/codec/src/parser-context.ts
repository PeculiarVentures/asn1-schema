import { ParseContext, AsnNode, CompiledSchema } from "./types";
import { AsnNodeUtils } from "./node-utils";

/**
 * Parse context implementation (supports two-phase schema binding)
 */

export class ParseContextImpl implements ParseContext {
  public integerAs: "auto" | "number" | "bigint";

  constructor(
    public data: Uint8Array,
    public schema: CompiledSchema | null,
    integerAs: "auto" | "number" | "bigint" = "auto",
  ) {
    this.data = AsnNodeUtils.toUint8Array(data);

    this.integerAs = integerAs;
  }

  sliceRaw(node: AsnNode): Uint8Array {
    if (!node.raw) {
      node.raw = this.data.subarray(node.start, node.end);
    }

    return node.raw;
  }

  sliceValueRaw(node: AsnNode): Uint8Array {
    if (!node.valueRaw) {
      node.valueRaw = this.data.subarray(node.headerEnd, node.end);
    }

    return node.valueRaw;
  }

  decode<T>(node: AsnNode): T {
    if (node.decoded !== null) {
      return node.decoded as T;
    }

    if (!this.schema || node.schemaId < 0) {
      throw new Error("Cannot decode node without schema binding");
    }

    const schemaNode = this.schema.nodes.get(node.schemaId);
    if (!schemaNode || !schemaNode.decoder) {
      throw new Error(`No decoder for schema node ${node.schemaId}`);
    }

    const result = schemaNode.decoder(node);
    node.decoded = result;
    return result as T;
  }
}

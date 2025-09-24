import { bindSchema, materialize, parseDER } from "@peculiar/asn1-codec";
import { BufferSource, BufferSourceConverter } from "pvtsutils";
import { schemaStorage } from "./storage";
import { IEmptyConstructor } from "./types";
import { AsnArray } from "./objects";
// import { AsnTypeTypes } from "./enums";

export class AsnParser {
  public static parse<T>(data: BufferSource, target: IEmptyConstructor<T>): T {
    // Normalize and validate input buffer
    if (!BufferSourceConverter.isBufferSource(data)) {
      // Back-compat: accept OctetString-like objects (custom ArrayBufferView with 'buffer')
      const anyData = data as unknown as { buffer?: unknown };
      if (anyData && typeof anyData === "object" && anyData.buffer instanceof ArrayBuffer) {
        data = anyData.buffer as unknown as BufferSource;
      } else {
        throw new TypeError(
          "Input data must be BufferSource (Buffer, ArrayBuffer, or ArrayBufferView)",
        );
      }
    }
    const input = BufferSourceConverter.toUint8Array(data);
    // Parse ASN.1 data into AST with BER mode (less strict)
    const result = parseDER(input, {
      mode: "ber",
    });

    if (result.errors?.length) {
      throw new Error(`Cannot parse ASN.1 data. ${result.errors[0].message}`);
    }

    // If no schema was registered for the target, but the target implements the
    // convertible interface (fromASN/toASN), use it directly on the parsed root.
    if (!schemaStorage.has(target)) {
      const instance = new target() as unknown as {
        fromASN?: (asn: { node: typeof result.root; context: typeof result.ctx }) => unknown;
        toASN?: () => unknown;
      };

      if (
        instance &&
        typeof instance.fromASN === "function" &&
        typeof instance.toASN === "function"
      ) {
        const converted = instance.fromASN!({ node: result.root, context: result.ctx });
        return converted as T;
      }

      // No schema and not convertible: return empty instance for backward compat
      return new target();
    }

    const schema = schemaStorage.get(target);

    // Ensure schema is cached (compiled) before using it
    if (!schema.schema) {
      schemaStorage.cache(target);
    }

    const boundSchema = bindSchema(result.root, result.ctx, schema.schema!);
    if (boundSchema.errors?.length) {
      throw new Error(`Cannot bind ASN.1 schema. ${boundSchema.errors[0].message}`);
    }

    // Materialize using parser with decoders producing final JS values/instances
    const object = materialize(boundSchema.root, boundSchema.ctx);

    // Apply default values for missing fields
    if (typeof object === "object" && object !== null) {
      for (const key in schema.items) {
        const item = schema.items[key];
        if (item.defaultValue !== undefined && !(key in (object as Record<string, unknown>))) {
          (object as Record<string, unknown>)[key] = item.defaultValue;
        }
      }
    }
    // If materialize already produced an instance of target or a convertible object, return it
    // If it's already correct instance or implements convertible interface
    if (
      object &&
      (object instanceof target ||
        (typeof object === "object" &&
          object !== null &&
          "fromASN" in (object as Record<string, unknown>) &&
          "toASN" in (object as Record<string, unknown>)))
    ) {
      return object as T;
    }
    // For AsnArray roots, materialize returns array already filled
    if (object && (object as object) instanceof AsnArray) {
      return object as T;
    }
    // Fallback: if parser returned plain object, assign to new target instance for compatibility
    const instance = new target() as unknown as Record<string, unknown>;
    if (object && typeof object === "object") {
      Object.assign(instance, object as Record<string, unknown>);
    }
    return instance as unknown as T;
  }

  public static fromASN<T>(asn1Schema: unknown, target: IEmptyConstructor<T>): T {
    // Legacy compatibility - just create empty instance
    return new target();
  }

  // materializeWithNames is no longer needed when schema decoders produce final values
}

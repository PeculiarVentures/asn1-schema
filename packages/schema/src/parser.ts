import * as asn1js from "asn1js";
import type { BufferSource } from "pvtsutils";
import { AsnPropTypes, AsnTypeTypes } from "./enums";
import * as converters from "./converters";
import { AsnSchemaValidationError } from "./errors";
import { isConvertible, isTypeOfArray } from "./helper";
import { schemaStorage } from "./storage";
import { IEmptyConstructor, IAsnConverter, IAsnConvertibleConstructor } from "./types";
import { AsnSchemaType } from "./schema";

/**
 * Deserializes objects from ASN.1 encoded data
 */
export class AsnParser {
  /**
   * Deserializes an object from the ASN.1 encoded buffer
   * @param data ASN.1 encoded buffer
   * @param target Target schema for object deserialization
   */
  public static parse<T>(data: BufferSource, target: IEmptyConstructor<T>): T {
    const asn1Parsed = asn1js.fromBER(data);
    if (asn1Parsed.result.error) {
      throw new Error(asn1Parsed.result.error);
    }

    const res = this.fromASN(asn1Parsed.result, target);
    return res;
  }

  /**
   * Deserializes an object from the asn1js object
   * @param asn1Schema asn1js object
   * @param target Target schema for object deserialization
   */
  public static fromASN<T>(asn1Schema: asn1js.AsnType, target: IEmptyConstructor<T>): T;
  public static fromASN<T>(asn1Schema: asn1js.AsnType, target: IEmptyConstructor<T>): unknown {
    try {
      if (isConvertible(target)) {
        const value = new (target as IAsnConvertibleConstructor)();
        return value.fromASN(asn1Schema);
      }

      const schema = schemaStorage.get(target);
      schemaStorage.cache(target);
      let targetSchema = schema.schema as AsnSchemaType;

      // Handle special cases for Choice types and IMPLICIT tagging
      const choiceResult = this.handleChoiceTypes(asn1Schema, schema, target, targetSchema);
      if (choiceResult?.result) {
        return choiceResult.result;
      }
      if (choiceResult?.targetSchema) {
        targetSchema = choiceResult.targetSchema;
      }

      // Handle SEQUENCE types with special logic
      const sequenceResult = this.handleSequenceTypes(asn1Schema, schema, target, targetSchema);
      const res = new target() as unknown as Record<string, unknown>;

      // Handle array types
      if (isTypeOfArray(target)) {
        return this.handleArrayTypes(asn1Schema, schema, target);
      }

      // Process schema items
      this.processSchemaItems(schema, sequenceResult, res);

      return res;
    } catch (error) {
      if (error instanceof AsnSchemaValidationError) {
        error.schemas.push(target.name);
      }
      throw error;
    }
  }

  /**
   * Handles Choice types with context tags (IMPLICIT) and IMPLICIT tagging
   */
  private static handleChoiceTypes<T>(
    asn1Schema: asn1js.AsnType,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    schema: any,
    target: IEmptyConstructor<T>,
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    targetSchema: AsnSchemaType,
  ): { result?: unknown; targetSchema?: AsnSchemaType } | null {
    // Special handling for Choice types with context tags (IMPLICIT)
    if (
      asn1Schema.constructor === asn1js.Constructed &&
      schema.type === AsnTypeTypes.Choice &&
      asn1Schema.idBlock.tagClass === 3
    ) {
      for (const key in schema.items) {
        const schemaItem = schema.items[key];
        if (schemaItem.context === asn1Schema.idBlock.tagNumber && schemaItem.implicit) {
          if (
            typeof schemaItem.type === "function" &&
            schemaStorage.has(schemaItem.type as IEmptyConstructor)
          ) {
            const fieldSchema = schemaStorage.get(schemaItem.type as IEmptyConstructor);
            if (fieldSchema && fieldSchema.type === AsnTypeTypes.Sequence) {
              const newSeq = new asn1js.Sequence();
              if (
                "value" in asn1Schema.valueBlock &&
                Array.isArray((asn1Schema.valueBlock as { value: asn1js.AsnType[] }).value) &&
                "value" in newSeq.valueBlock
              ) {
                (newSeq.valueBlock as { value: asn1js.AsnType[] }).value = (
                  asn1Schema.valueBlock as { value: asn1js.AsnType[] }
                ).value;

                const fieldValue = this.fromASN(newSeq, schemaItem.type as IEmptyConstructor);
                const res = new target() as unknown as Record<string, unknown>;
                res[key] = fieldValue;
                return { result: res };
              }
            }
          }
        }
      }
    } else if (
      asn1Schema.constructor === asn1js.Constructed &&
      schema.type !== AsnTypeTypes.Choice
    ) {
      // Fix tag value for IMPLICIT
      const newTargetSchema = new asn1js.Constructed({
        idBlock: {
          tagClass: 3,
          tagNumber: asn1Schema.idBlock.tagNumber,
        },
        value: (schema.schema as asn1js.Sequence).valueBlock.value,
      });

      // Delete all parsed values, because asn1js adds duplicated values to arrays
      for (const key in schema.items) {
        delete (asn1Schema as unknown as Record<string, unknown>)[key];
      }

      return { targetSchema: newTargetSchema };
    }

    return null;
  }

  /**
   * Handles SEQUENCE types with optional CHOICE fields and schema comparison
   */
  private static handleSequenceTypes(
    asn1Schema: asn1js.AsnType,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    schema: any,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    target: IEmptyConstructor<any>,
    targetSchema: AsnSchemaType,
  ): asn1js.CompareSchemaResult {
    if (schema.type === AsnTypeTypes.Sequence) {
      // Try normal schema comparison
      const asn1ComparedSchema = asn1js.compareSchema(
        {} as unknown as asn1js.AsnType,
        asn1Schema,
        targetSchema,
      );

      if (!asn1ComparedSchema.verified) {
        throw new AsnSchemaValidationError(
          `Data does not match to ${target.name} ASN1 schema.${asn1ComparedSchema.result.error ? ` ${asn1ComparedSchema.result.error}` : ""}`,
        );
      }

      return asn1ComparedSchema;
    } else {
      // Check the schema is valid for non-SEQUENCE types
      const asn1ComparedSchema = asn1js.compareSchema(
        {} as unknown as asn1js.AsnType,
        asn1Schema,
        targetSchema,
      );
      if (!asn1ComparedSchema.verified) {
        throw new AsnSchemaValidationError(
          `Data does not match to ${target.name} ASN1 schema.${asn1ComparedSchema.result.error ? ` ${asn1ComparedSchema.result.error}` : ""}`,
        );
      }
      return asn1ComparedSchema;
    }
  }

  /**
   * Processes repeated fields in manual mapping
   */
  private static processRepeatedField(
    asn1Elements: asn1js.AsnType[],
    asn1Index: number,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    schemaItem: any,
  ): unknown[] {
    let elementsToProcess = asn1Elements.slice(asn1Index);

    // Check if elements are wrapped in a SEQUENCE container
    if (elementsToProcess.length === 1 && elementsToProcess[0].constructor.name === "Sequence") {
      const seq = elementsToProcess[0] as { valueBlock?: { value?: asn1js.AsnType[] } };
      if (seq.valueBlock && seq.valueBlock.value && Array.isArray(seq.valueBlock.value)) {
        elementsToProcess = seq.valueBlock.value;
      }
    }

    if (typeof schemaItem.type === "number") {
      const converter = converters.defaultConverter(schemaItem.type);
      if (!converter) throw new Error(`No converter for ASN.1 type ${schemaItem.type}`);
      return elementsToProcess
        .filter((el) => el && el.valueBlock)
        .map((el) => {
          try {
            return converter.fromASN(el);
          } catch {
            return undefined;
          }
        })
        .filter((v) => v !== undefined);
    } else {
      return elementsToProcess
        .filter((el) => el && el.valueBlock)
        .map((el) => {
          try {
            return this.fromASN(el, schemaItem.type as IEmptyConstructor);
          } catch {
            return undefined;
          }
        })
        .filter((v) => v !== undefined);
    }
  }

  /**
   * Processes primitive fields in manual mapping
   */
  private static processPrimitiveField(
    asn1Element: asn1js.AsnType,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    schemaItem: any,
  ): unknown {
    const converter = converters.defaultConverter(schemaItem.type);
    if (!converter) throw new Error(`No converter for ASN.1 type ${schemaItem.type}`);
    return converter.fromASN(asn1Element);
  }

  /**
   * Checks if a schema item is an optional CHOICE field
   */
  private static isOptionalChoiceField(
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    schemaItem: any,
  ): boolean {
    return (
      schemaItem.optional &&
      typeof schemaItem.type === "function" &&
      schemaStorage.has(schemaItem.type as IEmptyConstructor) &&
      schemaStorage.get(schemaItem.type as IEmptyConstructor).type === AsnTypeTypes.Choice
    );
  }

  /**
   * Processes optional CHOICE fields in manual mapping
   */
  private static processOptionalChoiceField(
    asn1Element: asn1js.AsnType,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    schemaItem: any,
  ): { processed: boolean; value?: unknown } {
    try {
      const value = this.fromASN(asn1Element, schemaItem.type as IEmptyConstructor);
      return { processed: true, value };
    } catch (err) {
      if (
        err instanceof AsnSchemaValidationError &&
        /Wrong values for Choice type/.test(err.message)
      ) {
        return { processed: false };
      }
      throw err;
    }
  }

  /**
   * Handles array types
   */
  private static handleArrayTypes(
    asn1Schema: asn1js.AsnType,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    schema: any,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    target: IEmptyConstructor<any>,
  ): unknown {
    if (!("value" in asn1Schema.valueBlock && Array.isArray(asn1Schema.valueBlock.value))) {
      throw new Error(
        `Cannot get items from the ASN.1 parsed value. ASN.1 object is not constructed.`,
      );
    }

    const itemType = schema.itemType;
    if (typeof itemType === "number") {
      const converter = converters.defaultConverter(itemType);
      if (!converter) {
        throw new Error(
          `Cannot get default converter for array item of ${target.name} ASN1 schema`,
        );
      }
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      return (target as any).from(
        asn1Schema.valueBlock.value as asn1js.AsnType[],
        (element: asn1js.AsnType) => converter.fromASN(element),
      );
    } else {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      return (target as any).from(
        asn1Schema.valueBlock.value as asn1js.AsnType[],
        (element: asn1js.AsnType) => this.fromASN(element, itemType),
      );
    }
  }

  /**
   * Processes all schema items
   */
  private static processSchemaItems(
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    schema: any,
    asn1ComparedSchema: asn1js.CompareSchemaResult,
    res: Record<string, unknown>,
  ): void {
    for (const key in schema.items) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const asn1SchemaValue = (asn1ComparedSchema.result as any)[key] as asn1js.AsnType | undefined;
      if (!asn1SchemaValue) {
        continue; // skip empty props
      }

      const schemaItem = schema.items[key];
      const schemaItemType = schemaItem.type;

      let parsedValue: unknown;
      if (typeof schemaItemType === "number" || isConvertible(schemaItemType)) {
        parsedValue = this.processPrimitiveSchemaItem(asn1SchemaValue, schemaItem, schemaItemType);
      } else {
        parsedValue = this.processComplexSchemaItem(asn1SchemaValue, schemaItem, schemaItemType);
      }

      // Handle raw data if returned as object
      if (
        parsedValue &&
        typeof parsedValue === "object" &&
        "value" in parsedValue &&
        "raw" in parsedValue
      ) {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        res[key] = (parsedValue as any).value;
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        res[`${key}Raw`] = (parsedValue as any).raw;
      } else {
        res[key] = parsedValue;
      }
    }
  }

  /**
   * Processes primitive schema items
   */
  private static processPrimitiveSchemaItem(
    asn1SchemaValue: asn1js.AsnType,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    schemaItem: any,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    schemaItemType: any,
  ): unknown {
    const converter: IAsnConverter | null =
      schemaItem.converter ??
      (isConvertible(schemaItemType)
        ? new (schemaItemType as unknown as IAsnConvertibleConstructor)()
        : null);
    if (!converter) {
      throw new Error("Converter is empty");
    }

    if (schemaItem.repeated) {
      return this.processRepeatedPrimitiveItem(asn1SchemaValue, schemaItem, converter);
    } else {
      return this.processSinglePrimitiveItem(
        asn1SchemaValue,
        schemaItem,
        schemaItemType,
        converter,
      );
    }
  }

  /**
   * Processes repeated primitive items
   */
  private static processRepeatedPrimitiveItem(
    asn1SchemaValue: asn1js.AsnType,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    schemaItem: any,
    converter: IAsnConverter,
  ): unknown[] {
    if (schemaItem.implicit) {
      const Container = schemaItem.repeated === "sequence" ? asn1js.Sequence : asn1js.Set;
      const newItem = new Container();
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      newItem.valueBlock = asn1SchemaValue.valueBlock as any;
      const newItemAsn = asn1js.fromBER(newItem.toBER(false));
      if (newItemAsn.offset === -1) {
        throw new Error(`Cannot parse the child item. ${newItemAsn.result.error}`);
      }
      if (
        !(
          "value" in newItemAsn.result.valueBlock &&
          Array.isArray(newItemAsn.result.valueBlock.value)
        )
      ) {
        throw new Error(
          "Cannot get items from the ASN.1 parsed value. ASN.1 object is not constructed.",
        );
      }
      const value = newItemAsn.result.valueBlock.value as asn1js.AsnType[];
      return Array.from(value, (element) => converter.fromASN(element));
    } else {
      return Array.from(asn1SchemaValue as unknown as asn1js.AsnType[], (element) =>
        converter.fromASN(element),
      );
    }
  }

  /**
   * Processes single primitive items
   */
  private static processSinglePrimitiveItem(
    asn1SchemaValue: asn1js.AsnType,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    schemaItem: any,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    schemaItemType: any,
    converter: IAsnConverter,
  ): unknown {
    let value = asn1SchemaValue;
    if (schemaItem.implicit) {
      let newItem: asn1js.AsnType;
      if (isConvertible(schemaItemType)) {
        newItem = new (schemaItemType as unknown as IAsnConvertibleConstructor)().toSchema("");
      } else {
        const Asn1TypeName = AsnPropTypes[schemaItemType as number];
        const Asn1Type = (
          asn1js as unknown as Record<string, (new () => asn1js.AsnType) | undefined>
        )[Asn1TypeName];
        if (!Asn1Type) {
          throw new Error(`Cannot get '${Asn1TypeName}' class from asn1js module`);
        }
        newItem = new Asn1Type();
      }
      newItem.valueBlock = value.valueBlock;
      value = asn1js.fromBER(newItem.toBER(false)).result;
    }
    return converter.fromASN(value);
  }

  /**
   * Processes complex schema items (SEQUENCE, SET, CHOICE)
   */
  private static processComplexSchemaItem(
    asn1SchemaValue: asn1js.AsnType,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    schemaItem: any,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    schemaItemType: any,
  ): unknown {
    if (schemaItem.repeated) {
      if (!Array.isArray(asn1SchemaValue)) {
        throw new Error(
          "Cannot get list of items from the ASN.1 parsed value. ASN.1 value should be iterable.",
        );
      }
      return Array.from(asn1SchemaValue, (element: asn1js.AsnType) =>
        this.fromASN(element, schemaItemType),
      );
    } else {
      const valueToProcess = this.handleImplicitTagging(
        asn1SchemaValue,
        schemaItem,
        schemaItemType,
      );

      // Handle optional CHOICE with try/catch
      if (this.isOptionalChoiceField(schemaItem)) {
        try {
          return this.fromASN(valueToProcess, schemaItemType);
        } catch (err) {
          if (
            err instanceof AsnSchemaValidationError &&
            /Wrong values for Choice type/.test(err.message)
          ) {
            return undefined; // Skip this optional CHOICE field
          }
          throw err;
        }
      } else {
        const parsedValue = this.fromASN(valueToProcess, schemaItemType);
        // If raw is requested, return an object with value and raw
        if (schemaItem.raw) {
          return {
            value: parsedValue,
            raw: asn1SchemaValue.valueBeforeDecodeView,
          };
        }
        return parsedValue;
      }
    }
  }

  /**
   * Handles IMPLICIT tagging for complex types
   */
  private static handleImplicitTagging(
    asn1SchemaValue: asn1js.AsnType,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    schemaItem: any,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    schemaItemType: any,
  ): asn1js.AsnType {
    if (schemaItem.implicit && typeof schemaItem.context === "number") {
      const schema = schemaStorage.get(schemaItemType as IEmptyConstructor);

      if (schema.type === AsnTypeTypes.Sequence) {
        const newSeq = new asn1js.Sequence();
        if (
          "value" in asn1SchemaValue.valueBlock &&
          Array.isArray((asn1SchemaValue.valueBlock as { value: asn1js.AsnType[] }).value) &&
          "value" in newSeq.valueBlock
        ) {
          (newSeq.valueBlock as { value: asn1js.AsnType[] }).value = (
            asn1SchemaValue.valueBlock as { value: asn1js.AsnType[] }
          ).value;
          return newSeq;
        }
      } else if (schema.type === AsnTypeTypes.Set) {
        const newSet = new asn1js.Set();
        if (
          "value" in asn1SchemaValue.valueBlock &&
          Array.isArray((asn1SchemaValue.valueBlock as { value: asn1js.AsnType[] }).value) &&
          "value" in newSet.valueBlock
        ) {
          (newSet.valueBlock as { value: asn1js.AsnType[] }).value = (
            asn1SchemaValue.valueBlock as { value: asn1js.AsnType[] }
          ).value;
          return newSet;
        }
      }
      // For Choice types and other cases, use the value as-is
    }
    return asn1SchemaValue;
  }
}

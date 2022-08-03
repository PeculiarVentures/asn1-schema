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

      //#region Verify incoming ASN1 object with target schema
      if (asn1Schema.constructor === asn1js.Constructed && schema.type !== AsnTypeTypes.Choice) {
        // fix tag value for IMPLICIT
        targetSchema = new asn1js.Constructed({
          idBlock: {
            tagClass: 3,
            tagNumber: asn1Schema.idBlock.tagNumber,
          },
          value: (schema.schema as asn1js.Sequence).valueBlock.value,
        });
        // delete all parsed values, because asn1js adds duplicated values to arrays
        for (const key in schema.items) {
          delete (asn1Schema as unknown as Record<string, unknown>)[key];
        }
      }

      // Check the schema is valid
      const asn1ComparedSchema = asn1js.compareSchema(
        {} as unknown as asn1js.AsnType,
        asn1Schema,
        targetSchema,
      );
      if (!asn1ComparedSchema.verified) {
        throw new AsnSchemaValidationError(`Data does not match to ${target.name} ASN1 schema. ${asn1ComparedSchema.result.error}`);
      }
      //#endregion

      const res = new target() as unknown as Record<string, unknown>;

      if (isTypeOfArray(target)) {
        // TODO convert
        if (!("value" in asn1Schema.valueBlock && Array.isArray(asn1Schema.valueBlock.value))) {
          throw new Error(`Cannot get items from the ASN.1 parsed value. ASN.1 object is not constructed.`);
        }
        const itemType = schema.itemType;
        if (typeof itemType === "number") {
          const converter = converters.defaultConverter(itemType);
          if (!converter) {
            throw new Error(`Cannot get default converter for array item of ${target.name} ASN1 schema`);
          }
          return target.from(asn1Schema.valueBlock.value as asn1js.AsnType[], (element) => converter.fromASN(element));
        } else {
          return target.from(asn1Schema.valueBlock.value as asn1js.AsnType[], (element) => this.fromASN(element, itemType));
        }
      }

      for (const key in schema.items) {
        const asn1SchemaValue = asn1ComparedSchema.result[key] as asn1js.AsnType | undefined;
        if (!asn1SchemaValue) {
          // TODO: we need to skip empty values for Choice and Optional params
          continue; // skip empty props
        }
        const schemaItem = schema.items[key];

        const schemaItemType = schemaItem.type;
        if (typeof schemaItemType === "number" || isConvertible(schemaItemType)) {
          // PRIMITIVE
          // we MUST to use Converters
          const converter: IAsnConverter | null = schemaItem.converter
            ?? (isConvertible(schemaItemType)
              ? new (schemaItemType as IAsnConvertibleConstructor)()
              : null);
          if (!converter) {
            throw new Error("Converter is empty");
          }
          if (schemaItem.repeated) {
            if (schemaItem.implicit) {
              const Container = schemaItem.repeated === "sequence"
                ? asn1js.Sequence
                : asn1js.Set;
              const newItem = new Container();
              // eslint-disable-next-line @typescript-eslint/no-explicit-any
              newItem.valueBlock = asn1SchemaValue.valueBlock as any;
              const newItemAsn = asn1js.fromBER(newItem.toBER(false));
              if (newItemAsn.offset === -1) {
                throw new Error(`Cannot parse the child item. ${newItemAsn.result.error}`);
              }
              if (!("value" in newItemAsn.result.valueBlock && Array.isArray(newItemAsn.result.valueBlock.value))) {
                throw new Error("Cannot get items from the ASN.1 parsed value. ASN.1 object is not constructed.");
              }
              const value = newItemAsn.result.valueBlock.value as asn1js.AsnType[];
              res[key] = Array.from(value, (element) => converter.fromASN(element));
            } else {
              res[key] = Array.from(asn1SchemaValue as unknown as asn1js.AsnType[], (element) => converter.fromASN(element));
            }
          } else {
            let value = asn1SchemaValue;
            if (schemaItem.implicit) {
              let newItem: asn1js.AsnType;
              if (isConvertible(schemaItemType)) {
                newItem = new (schemaItemType as IAsnConvertibleConstructor)().toSchema("");
              } else {
                const Asn1TypeName = AsnPropTypes[schemaItemType as number];
                const Asn1Type = (asn1js as unknown as Record<string, (new () => asn1js.AsnType) | undefined>)[Asn1TypeName];
                if (!Asn1Type) {
                  throw new Error(`Cannot get '${Asn1TypeName}' class from asn1js module`);
                }
                newItem = new Asn1Type();
              }
              newItem.valueBlock = value.valueBlock;
              value = asn1js.fromBER(newItem.toBER(false)).result;
            }
            res[key] = converter.fromASN(value);
          }
        } else {
          // SEQUENCE | SET | CHOICE
          // use ASN1 schema
          if (schemaItem.repeated) {
            if (!Array.isArray(asn1SchemaValue)) {
              throw new Error("Cannot get list of items from the ASN.1 parsed value. ASN.1 value should be iterable.");
            }
            res[key] = Array.from(asn1SchemaValue, (element: asn1js.AsnType) =>
              this.fromASN(element, schemaItemType));
          } else {
            res[key] = this.fromASN(asn1SchemaValue, schemaItemType);
          }
        }
      }

      // Add cache
      // TODO Implement cache usage. It can be useful for getting ASN.1 object from cache during serialization
      //      instead of creating ASN.1 object each time
      // res._cache = { asn1: asn1Schema };

      return res;
    } catch (error) {
      if (error instanceof AsnSchemaValidationError) {
        error.schemas.push(target.name);
      }
      throw error;
    }
  }
}

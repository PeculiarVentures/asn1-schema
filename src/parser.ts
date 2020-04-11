// @ts-ignore
import * as asn1 from "asn1js";
import { AsnPropTypes, AsnTypeTypes } from "./enums";
import { AsnSchemaValidationError } from "./errors";
import { isConvertible } from "./helper";
import { schemaStorage } from "./storage";
import { IEmptyConstructor } from "./types";

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
    let buf: ArrayBuffer;
    if (data instanceof ArrayBuffer) {
      buf = data;
    } else if (typeof Buffer !== undefined && Buffer.isBuffer(data)) {
      buf = new Uint8Array(data).buffer;
    } else if (ArrayBuffer.isView(data)) {
      buf = data.buffer;
    } else {
      throw new TypeError("Wrong type of 'data' argument");
    }

    const asn1Parsed = asn1.fromBER(buf);
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
  public static fromASN<T>(asn1Schema: any, target: IEmptyConstructor<T>): any;
  public static fromASN<T>(asn1Schema: any, target: IEmptyConstructor<T>) {
    try {
      if (isConvertible(target)) {
        const value = new target() as any;
        return value.fromASN(asn1Schema);
      }

      const schema = schemaStorage.get(target);
      schemaStorage.cache(target);
      let targetSchema = schema.schema;

      //#region Verify incoming ASN1 object with target schema
      if (asn1Schema.constructor === asn1.Constructed && schema.type !== AsnTypeTypes.Choice) {
        // fix tag value for IMPLICIT
        targetSchema = new asn1.Constructed({
          idBlock: {
            tagClass: 3,
            tagNumber: asn1Schema.idBlock.tagNumber,
          },
          value: schema.schema.valueBlock.value,
        });
        // delete all parsed values, because asn1js adds duplicated values to arrays
        for (const key in schema.items) {
          delete asn1Schema[key];
        }
      }

      // Check the schema is valid
      const asn1ComparedSchema = asn1.compareSchema(
        asn1Schema,
        asn1Schema,
        targetSchema,
      );
      if (!asn1ComparedSchema.verified) {
        throw new AsnSchemaValidationError(`Data does not match to ${target.name} ASN1 schema. ${asn1ComparedSchema.result.error}`);
      }
      //#endregion

      const res = new target() as any;

      for (const key in schema.items) {
        if (!asn1Schema[key]) {
          // TODO: we need to skip empty values for Choice and Optional params
          continue; // skip empty props
        }
        const schemaItem = schema.items[key];

        if (typeof (schemaItem.type) === "number") {
          // PRIMITIVE
          // we MUST to use Converters
          const converter = schemaItem.converter;
          if (!converter) {
            throw new Error("Converter is empty");
          }
          if (schemaItem.repeated) {
            if (schemaItem.implicit && typeof schemaItem.repeated === "string") {
              const Container = schemaItem.repeated === "sequence"
                ? asn1.Sequence
                : asn1.Set;
              const newItem = new Container();
              newItem.valueBlock = asn1Schema[key].valueBlock;
              const value = asn1.fromBER(newItem.toBER(false)).result.valueBlock.value;
              res[key] = Array.from(value, (element) => converter.fromASN(element));
            } else {
              res[key] = Array.from(asn1Schema[key], (element) => converter.fromASN(element));
            }
          } else {
            let value = asn1Schema[key];
            if (schemaItem.implicit) {
              const Asn1TypeName = AsnPropTypes[schemaItem.type];
              const Asn1Type = asn1[Asn1TypeName];
              if (!Asn1Type) {
                throw new Error(`Cannot get '${Asn1TypeName}' class from asn1js module`);
              }
              const newItem = new Asn1Type();
              newItem.valueBlock = value.valueBlock;
              value = asn1.fromBER(newItem.toBER(false)).result;
            }
            res[key] = converter.fromASN(value);
          }
        } else {
          // SEQUENCE | SET | CHOICE
          // use ASN1 schema
          if (schemaItem.repeated) {
            res[key] = Array.from(asn1Schema[key], (element: any) =>
              this.fromASN(element, schemaItem.type as any));
          } else {
            res[key] = this.fromASN(asn1Schema[key], schemaItem.type);
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

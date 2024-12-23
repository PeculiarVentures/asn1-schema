import * as asn1js from "asn1js";
import * as converters from "./converters";
import { AsnPropTypes, AsnTypeTypes } from "./enums";
import { isConvertible, isArrayEqual } from "./helper";
import { schemaStorage } from "./storage";
import { IAsnSchemaItem } from "./schema";
import { IEmptyConstructor } from "./types";

/**
 * Serializes objects into ASN.1 encoded data
 */
export class AsnSerializer {
  /**
   * Serializes an object to the ASN.1 encoded buffer
   * @param obj The object to serialize
   */
  public static serialize(obj: unknown): ArrayBuffer {
    if (obj instanceof asn1js.BaseBlock) {
      return obj.toBER(false);
    }
    return this.toASN(obj).toBER(false);
  }

  /**
   * Serialize an object to the asn1js object
   * @param obj The object to serialize
   */
  public static toASN(obj: unknown): asn1js.AsnType {
    if (obj && typeof obj === "object" && isConvertible(obj)) {
      return obj.toASN();
    }

    if (!(obj && typeof obj === "object")) {
      throw new TypeError("Parameter 1 should be type of Object.");
    }
    const target = obj.constructor as IEmptyConstructor;
    const schema = schemaStorage.get(target);
    schemaStorage.cache(target);

    let asn1Value: asn1js.AsnType[] = [];

    if (schema.itemType) {
      // repeated
      if (!Array.isArray(obj)) {
        throw new TypeError("Parameter 1 should be type of Array.");
      }
      if (typeof schema.itemType === "number") {
        // primitive
        const converter = converters.defaultConverter(schema.itemType);
        if (!converter) {
          throw new Error(
            `Cannot get default converter for array item of ${target.name} ASN1 schema`,
          );
        }
        asn1Value = obj.map((o) => converter.toASN(o));
      } else {
        // constructed
        asn1Value = obj.map((o) => this.toAsnItem({ type: schema.itemType }, "[]", target, o));
      }
    } else {
      for (const key in schema.items) {
        const schemaItem = schema.items[key];
        const objProp = (obj as Record<string, unknown>)[key];

        // Default value
        if (
          objProp === undefined ||
          schemaItem.defaultValue === objProp ||
          (typeof schemaItem.defaultValue === "object" &&
            typeof objProp === "object" &&
            isArrayEqual(this.serialize(schemaItem.defaultValue), this.serialize(objProp)))
        ) {
          continue; // skip item
        }

        const asn1Item = AsnSerializer.toAsnItem(schemaItem, key, target, objProp);
        if (typeof schemaItem.context === "number") {
          // CONTEXT-SPECIFIC
          if (schemaItem.implicit) {
            // IMPLICIT
            if (
              !schemaItem.repeated &&
              (typeof schemaItem.type === "number" || isConvertible(schemaItem.type))
            ) {
              const value: { valueHex?: ArrayBuffer; value?: ArrayBuffer } = {};
              value.valueHex =
                asn1Item instanceof asn1js.Null
                  ? asn1Item.valueBeforeDecodeView
                  : asn1Item.valueBlock.toBER();
              asn1Value.push(
                new asn1js.Primitive({
                  optional: schemaItem.optional,
                  idBlock: {
                    tagClass: 3,
                    tagNumber: schemaItem.context,
                  },
                  ...value,
                }),
              );
            } else {
              asn1Value.push(
                new asn1js.Constructed({
                  optional: schemaItem.optional,
                  idBlock: {
                    tagClass: 3,
                    tagNumber: schemaItem.context,
                  },
                  // eslint-disable-next-line @typescript-eslint/no-explicit-any
                  value: (asn1Item as any).valueBlock.value,
                }),
              );
            }
          } else {
            // EXPLICIT
            asn1Value.push(
              new asn1js.Constructed({
                optional: schemaItem.optional,
                idBlock: {
                  tagClass: 3,
                  tagNumber: schemaItem.context,
                },
                value: [asn1Item],
              }),
            );
          }
        } else if (schemaItem.repeated) {
          asn1Value = asn1Value.concat(asn1Item);
        } else {
          // UNIVERSAL
          asn1Value.push(asn1Item);
        }
      }
    }

    let asnSchema: asn1js.AsnType;
    switch (schema.type) {
      case AsnTypeTypes.Sequence:
        asnSchema = new asn1js.Sequence({ value: asn1Value });
        break;
      case AsnTypeTypes.Set:
        asnSchema = new asn1js.Set({ value: asn1Value });
        break;
      case AsnTypeTypes.Choice:
        if (!asn1Value[0]) {
          throw new Error(`Schema '${target.name}' has wrong data. Choice cannot be empty.`);
        }
        asnSchema = asn1Value[0];
        break;
    }

    return asnSchema;
  }

  // @internal
  private static toAsnItem(
    schemaItem: IAsnSchemaItem,
    key: string,
    target: IEmptyConstructor,
    objProp: unknown,
  ): asn1js.AsnType {
    let asn1Item: asn1js.AsnType;
    if (typeof schemaItem.type === "number") {
      // type is AsnPropType Enum
      // we MUST to use Converters
      const converter = schemaItem.converter;
      if (!converter) {
        // tslint:disable-next-line:max-line-length
        throw new Error(
          `Property '${key}' doesn't have converter for type ${AsnPropTypes[schemaItem.type]} in schema '${target.name}'`,
        );
      }
      if (schemaItem.repeated) {
        if (!Array.isArray(objProp)) {
          throw new TypeError("Parameter 'objProp' should be type of Array.");
        }
        const items = Array.from(objProp, (element) => converter.toASN(element));
        const Container = schemaItem.repeated === "sequence" ? asn1js.Sequence : asn1js.Set;
        asn1Item = new Container({
          value: items,
        });
      } else {
        asn1Item = converter.toASN(objProp);
      }
    } else {
      // type is class with schema
      // use ASN1 schema
      if (schemaItem.repeated) {
        if (!Array.isArray(objProp)) {
          throw new TypeError("Parameter 'objProp' should be type of Array.");
        }
        const items = Array.from(objProp, (element) => this.toASN(element));
        const Container = schemaItem.repeated === "sequence" ? asn1js.Sequence : asn1js.Set;
        asn1Item = new Container({
          value: items,
        });
      } else {
        asn1Item = this.toASN(objProp);
      }
    }
    return asn1Item;
  }
}

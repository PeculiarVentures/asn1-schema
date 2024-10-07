import * as asn1js from "asn1js";
import { AsnRepeatType } from "./decorators";
import { AsnPropTypes, AsnTypeTypes } from "./enums";
import { IAsnConverter, IEmptyConstructor, IAsnConvertible } from "./types";
import { isConvertible } from "./helper";

export interface IAsnSchemaItem {
  type: AsnPropTypes | IEmptyConstructor;
  optional?: boolean;
  defaultValue?: unknown;
  context?: number;
  application?: number;
  implicit?: boolean;
  converter?: IAsnConverter;
  repeated?: AsnRepeatType;
}

export interface IAsnSchema {
  type: AsnTypeTypes;
  itemType: AsnPropTypes | IEmptyConstructor;
  items: { [key: string]: IAsnSchemaItem; };
  schema?: AsnSchemaType;
}

export type AsnSchemaType = asn1js.Sequence | asn1js.Set | asn1js.Choice;

export class AsnSchemaStorage {
  protected items = new WeakMap<object, IAsnSchema>();

  public has(target: object): boolean {
    return this.items.has(target);
  }

  public get(target: IEmptyConstructor, checkSchema: true): IAsnSchema & Required<Pick<IAsnSchema, "schema">>;
  public get(target: IEmptyConstructor, checkSchema?: false): IAsnSchema;
  public get(target: IEmptyConstructor, checkSchema = false): IAsnSchema {
    const schema = this.items.get(target);
    if (!schema) {
      throw new Error(`Cannot get schema for '${target.prototype.constructor.name}' target`);
    }
    if (checkSchema && !schema.schema) {
      throw new Error(`Schema '${target.prototype.constructor.name}' doesn't contain ASN.1 schema. Call 'AsnSchemaStorage.cache'.`);
    }
    return schema;
  }

  public cache(target: IEmptyConstructor): void {
    const schema = this.get(target);
    if (!schema.schema) {
      schema.schema = this.create(target, true);
    }
  }

  public createDefault(target: object): IAsnSchema {
    // Initialize default ASN1 schema
    const schema = {
      type: AsnTypeTypes.Sequence,
      items: {},
    } as IAsnSchema;

    // Get and assign schema from parent
    const parentSchema = this.findParentSchema(target);
    if (parentSchema) {
      Object.assign(schema, parentSchema);
      schema.items = Object.assign({}, schema.items, parentSchema.items);
    }

    return schema;
  }

  public create(target: object, useNames: boolean): AsnSchemaType {
    const schema = this.items.get(target) || this.createDefault(target);

    const asn1Value = [];
    for (const key in schema.items) {
      const item = schema.items[key];
      const name = useNames ? key : "";
      let asn1Item: asn1js.AsnSchemaType;
      if (typeof (item.type) === "number") {
        // type is AsnPropType Enum
        const Asn1TypeName = AsnPropTypes[item.type];
        const Asn1Type = (asn1js as unknown as Record<string, typeof asn1js.BaseBlock>)[Asn1TypeName];
        if (!Asn1Type) {
          throw new Error(`Cannot get ASN1 class by name '${Asn1TypeName}'`);
        }
        asn1Item = new Asn1Type({ name });
      } else if (isConvertible(item.type)) {
        const instance: IAsnConvertible = new item.type();
        asn1Item = instance.toSchema(name);
      } else if (item.optional) {
        // For OPTIONAL and CONSTRUCTED properties we need to validate schema
        //
        // `UserNotice` has two OPTIONAL properties, without correct schema validation it
        // assigns `explicitText` to `noticeRef`
        const itemSchema = this.get(item.type);
        if (itemSchema.type === AsnTypeTypes.Choice) {
          // ASN1.js doesn't assign CHOICE to named property
          // Use ANY block to fix it
          asn1Item = new asn1js.Any({ name });
        } else {
          asn1Item = this.create(item.type, false);
          asn1Item.name = name;
        }
      } else {
        // type is class with schema
        // asn1Item = createAsn1Schema(item.type, schema.type === Asn1TypeType.Choice ? true : false);
        asn1Item = new asn1js.Any({ name });
        // asn1Item.name = name;
      }
      const optional = !!item.optional || item.defaultValue !== undefined;
      if (item.repeated) {
        asn1Item.name = ""; // erase name for repeated items
        const Container = item.repeated === "set"
          ? asn1js.Set
          : asn1js.Sequence;
        asn1Item = new Container({
          name: "",
          value: [
            new asn1js.Repeated({
              name,
              value: asn1Item,
            }),
          ],
        });
      }
      if (item.context !== null && item.context !== undefined) {
        // CONTEXT-SPECIFIC
        if (item.implicit) {
          // IMPLICIT
          if (typeof item.type === "number" || isConvertible(item.type)) {
            const Container = item.repeated
              ? asn1js.Constructed
              : asn1js.Primitive;
            asn1Value.push(new Container({
              name,
              optional,
              idBlock: {
                tagClass: 3,
                tagNumber: item.context,
              },
            }));
          } else {
            this.cache(item.type);
            const isRepeated = !!item.repeated;
            let value = !isRepeated
              ? this.get(item.type, true).schema
              : asn1Item;
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            value = "valueBlock" in value ? (value as asn1js.Sequence).valueBlock.value : (value as any).value;
            asn1Value.push(new asn1js.Constructed({
              name: !isRepeated ? name : "",
              optional,
              idBlock: {
                tagClass: 3,
                tagNumber: item.context,
              },
              // eslint-disable-next-line @typescript-eslint/no-explicit-any
              value: value as any,
            }));
          }
        } else {
          // EXPLICIT
          asn1Value.push(new asn1js.Constructed({
            optional,
            idBlock: {
              tagClass: 3,
              tagNumber: item.context,
            },
            value: [asn1Item],
          }));
        }
      }
      else if (item.application !== null && item.application !== undefined) {
        // APPLICATION
        if(item.implicit) {
          // IMPLICIT
          if (typeof item.type === "number" || isConvertible(item.type)) {
            const Container = item.repeated
              ? asn1js.Constructed
              : asn1js.Primitive;
            asn1Value.push(new Container({
              name,
              optional,
              idBlock: {
                tagClass:2,
                tagNumber: item.application,
              },
            }));
          } else {
            this.cache(item.type);
            const isRepeated = !!item.repeated;
            let value = !isRepeated
              ? this.get(item.type, true).schema
              : asn1Item;
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            value = "valueBlock" in value ? (value as asn1js.Sequence).valueBlock.value : (value as any).value;
            asn1Value.push(new asn1js.Constructed({
              name: !isRepeated ? name : "",
              optional,
              idBlock: {
                tagClass: 2,
                tagNumber: item.application,
              },
              // eslint-disable-next-line @typescript-eslint/no-explicit-any
              value: value as any,
            }));
          }
        } else {
          // EXPLICIT
          asn1Value.push(new asn1js.Constructed({
            optional,
            idBlock: {
              tagClass: 2,
              tagNumber: item.application
            },
            value: [asn1Item]
          }))
        }
      }
      else {
        // UNIVERSAL
        asn1Item.optional = optional;
        asn1Value.push(asn1Item);
      }
    }

    switch (schema.type) {
      case AsnTypeTypes.Sequence:
        return new asn1js.Sequence({ value: asn1Value, name: "" });
      case AsnTypeTypes.Set:
        return new asn1js.Set({ value: asn1Value, name: "" });
      case AsnTypeTypes.Choice:
        return new asn1js.Choice({ value: asn1Value as asn1js.BaseBlock[], name: "" });
      default:
        throw new Error(`Unsupported ASN1 type in use`);
    }
  }

  public set(target: object, schema: IAsnSchema): this {
    this.items.set(target, schema);
    return this;
  }

  protected findParentSchema(target: object): IAsnSchema | null {
    const parent = Object.getPrototypeOf(target);
    if (parent) {
      const schema = this.items.get(parent);
      return schema || this.findParentSchema(parent);
    }
    return null;
  }

}

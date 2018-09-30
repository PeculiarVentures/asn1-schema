/// <reference path="./types.d.ts" />

const asn1 = require("asn1js");
import { Asn1PropTypes, Asn1TypeTypes } from "./enums";

export interface IAsn1SchemaItem {
  type: Asn1PropTypes | IEmptyConstructor<any>;
  optional?: boolean;
  defaultValue?: any;
  context?: number;
  implicit?: boolean;
  converter?: IAsn1Converter;
  repeated?: boolean;
}

export interface IAsn1Schema {
  type: Asn1TypeTypes;
  items: { [key: string]: IAsn1SchemaItem };
  schema?: any;
}

export class Asn1SchemaStorage {
  protected items = new Map<object, IAsn1Schema>();

  public has(target: object) {
    return this.items.has(target);
  }

  public get(target: object) {
    const schema = this.items.get(target);
    if (!schema) {
      throw new Error("Cannot get schema for current target");
    }
    return schema;
  }

  public cache(target: object) {
    const schema = this.get(target);
    if (!schema.schema) {
      schema.schema = this.create(target, true);
    }
  }

  public createDefault(target: object) {
    // Initialize default ASN1 schema
    const schema = {
      type: Asn1TypeTypes.Sequence,
      items: {},
    } as IAsn1Schema;

    // Get and assign schema from parent
    const parentSchema = this.findParentSchema(target);
    if (parentSchema) {
      Object.assign(schema, parentSchema);
      schema.items = Object.assign({}, schema.items, parentSchema.items);
    }

    return schema;
  }

  public create(target: object, useNames: boolean) {
    const schema = this.items.get(target) || this.createDefault(target);

    const asn1Value = [];
    for (const key in schema.items) {
      const item = schema.items[key];
      const name = useNames ? key : "";
      let asn1Item: any;
      if (typeof (item.type) === "number") {
        // type is Asn1PropType Enum
        const Asn1TypeName = Asn1PropTypes[item.type];
        const Asn1Type = asn1[Asn1TypeName];
        if (!Asn1Type) {
          throw new Error(`Cannot get ASN1 class by name '${Asn1TypeName}'`);
        }
        asn1Item = new Asn1Type({ name });
      } else {
        // type is class with schema
        // asn1Item = createAsn1Schema(item.type, schema.type === Asn1TypeType.Choice ? true : false);
        asn1Item = new asn1.Any({ name });
        // asn1Item.name = name;
      }
      const optional = !!item.optional || item.defaultValue !== undefined;
      if (item.repeated) {
        asn1Item.name = "";
        asn1Item = new asn1.Repeated({
          name,
          value: asn1Item,
        });
      }
      if (item.context !== null && item.context !== undefined) {
        // CONTEXT-SPECIFIC
        if (item.implicit) {
          // IMPLICIT
          if (typeof item.type === "number") {
            asn1Value.push(new asn1.Primitive({
              name,
              optional,
              idBlock: {
                tagClass: 3,
                tagNumber: item.context,
              },
            }));
          } else {
            this.cache(item.type);
            const value = this.get(item.type).schema.valueBlock.value;
            asn1Value.push(new asn1.Constructed({
              name,
              optional,
              idBlock: {
                tagClass: 3,
                tagNumber: item.context,
              },
              value,
            }));
          }
        } else {
          // EXPLICIT
          asn1Value.push(new asn1.Constructed({
            optional,
            idBlock: {
              tagClass: 3,
              tagNumber: item.context,
            },
            value: [asn1Item],
          }));
        }
      } else {
        // UNIVERSAL
        asn1Item.optional = optional;
        asn1Value.push(asn1Item);
      }
    }

    switch (schema.type) {
      case Asn1TypeTypes.Sequence:
        return new asn1.Sequence({ value: asn1Value, name: "" });
      case Asn1TypeTypes.Set:
        return new asn1.Set({ value: asn1Value, name: "" });
      case Asn1TypeTypes.Choice:
        return new asn1.Choice({ value: asn1Value, name: "" });
      default:
        throw new Error(`Unsupported ASN1 type in use`);
    }
  }

  public set(target: object, schema: IAsn1Schema) {
    this.items.set(target, schema);
    return this;
  }

  protected findParentSchema(target: object): IAsn1Schema | null {
    const parent = (target as any).__proto__;
    if (parent) {
      const schema = this.items.get(parent);
      return schema || this.findParentSchema(parent);
    }
    return null;
  }

}

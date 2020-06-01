import * as converters from "./converters";
import { AsnPropTypes, AsnTypeTypes } from "./enums";
import { IAsnSchema, IAsnSchemaItem } from "./schema";
import { schemaStorage } from "./storage";
import { IAsnConverter, IEmptyConstructor } from "./types";

interface IAsn1TypeOptions {
  type: AsnTypeTypes;
  itemType?: AsnPropTypes | IEmptyConstructor<any>;
}
export type AsnRepeatTypeString = "sequence" | "set";

export type AsnRepeatType = AsnRepeatTypeString;

interface IAsn1PropOptions {
  type: AsnPropTypes | IEmptyConstructor<any>;
  optional?: boolean;
  defaultValue?: any;
  context?: number;
  implicit?: boolean;
  converter?: IAsnConverter;
  repeated?: AsnRepeatType;
}

export const AsnType = (options: IAsn1TypeOptions) => (target: object) => {
  let schema: IAsnSchema;
  if (!schemaStorage.has(target)) {
    schema = schemaStorage.createDefault(target);
    schemaStorage.set(target, schema);
  } else {
    schema = schemaStorage.get(target);
  }
  Object.assign(schema, options);
};

export const AsnProp = (options: IAsn1PropOptions) => (target: object, propertyKey: string) => {
  let schema: IAsnSchema;
  if (!schemaStorage.has(target.constructor)) {
    schema = schemaStorage.createDefault(target.constructor);
    schemaStorage.set(target.constructor, schema);
  } else {
    schema = schemaStorage.get(target.constructor);
  }

  const copyOptions = Object.assign({}, options) as IAsnSchemaItem;

  if (typeof copyOptions.type === "number" && !copyOptions.converter) {
    // Set default converters
    const defaultConverter = converters.defaultConverter(options.type as AsnPropTypes);
    if (!defaultConverter) {
      throw new Error(`Cannot get default converter for property '${propertyKey}' of ${target.constructor.name}`);
    }
    copyOptions.converter = defaultConverter;
  }

  schema.items[propertyKey] = copyOptions;
};

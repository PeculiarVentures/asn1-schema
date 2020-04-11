import * as defaultConverters from "./converters";
import { AsnPropTypes, AsnTypeTypes } from "./enums";
import { IAsnSchema, IAsnSchemaItem } from "./schema";
import { schemaStorage } from "./storage";
import { IAsnConverter, IEmptyConstructor } from "./types";

interface IAsn1TypeOptions {
  type: AsnTypeTypes;
}
export type AsnRepeatTypeString = "sequence" | "set";

export type AsnRepeatType = boolean | AsnRepeatTypeString;

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
  const schema = schemaStorage.get(target);
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
    const converterName = `Asn${AsnPropTypes[options.type as number]}Converter`;
    const defaultConverter = (defaultConverters as any)[converterName] as IAsnConverter;
    if (!defaultConverter) {
      throw new Error(`Cannot get '${converterName}' for property '${propertyKey}' of ${target.constructor.name}`);
    }
    copyOptions.converter = defaultConverter;
  }

  schema.items[propertyKey] = copyOptions;
};

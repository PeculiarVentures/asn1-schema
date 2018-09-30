import * as defaultConverters from "./converters";
import { Asn1PropTypes, Asn1TypeTypes } from "./enums";
import { IAsn1Schema, IAsn1SchemaItem } from "./schema";
import { schemaStorage } from "./storage";

interface IAsn1TypeOptions {
  type: Asn1TypeTypes;
}

interface IAsn1PropOptions {
  type: Asn1PropTypes | IEmptyConstructor<any>;
  optional?: boolean;
  defaultValue?: any;
  context?: number;
  implicit?: boolean;
  converter?: IAsn1Converter;
  repeated?: boolean;
}

export const Asn1Type = (options: IAsn1TypeOptions) => (target: object) => {
  const schema = schemaStorage.get(target);
  Object.assign(schema, options);
};

export const Asn1Prop = (options: IAsn1PropOptions) => (target: object, propertyKey: string) => {
  let schema: IAsn1Schema;
  if (!schemaStorage.has(target.constructor)) {
    schema = schemaStorage.createDefault(target.constructor);
    schemaStorage.set(target.constructor, schema);
  } else {
    schema = schemaStorage.get(target.constructor);
  }

  const copyOptions = Object.assign({}, options) as IAsn1SchemaItem;

  if (typeof copyOptions.type === "number" && !copyOptions.converter) {
    // Set default converters
    const converterName = `Asn${Asn1PropTypes[options.type as number]}Converter`;
    const defaultConverter = (defaultConverters as any)[converterName] as IAsn1Converter;
    if (!defaultConverter) {
      throw new Error(`Cannot get '${converterName}' for property '${propertyKey}' of ${target.constructor.name}`);
    }
    copyOptions.converter = defaultConverter;
  }

  schema.items[propertyKey] = copyOptions;
};

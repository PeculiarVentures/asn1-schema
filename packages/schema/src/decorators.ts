import * as converters from "./converters";
import { AsnPropTypes, AsnTypeTypes } from "./enums";
import { IAsnSchema, IAsnSchemaItem } from "./schema";
import { schemaStorage } from "./storage";
import { IAsnConverter, IEmptyConstructor } from "./types";

export type AsnItemType<T = unknown> = AsnPropTypes | IEmptyConstructor<T>;

export interface IAsn1TypeOptions {
  type: AsnTypeTypes;
  itemType?: AsnItemType;
}
export type AsnRepeatTypeString = "sequence" | "set";

export type AsnRepeatType = AsnRepeatTypeString;

export interface IAsn1PropOptions {
  type: AsnItemType;
  optional?: boolean;
  defaultValue?: unknown;
  context?: number;
  implicit?: boolean;
  converter?: IAsnConverter;
  repeated?: AsnRepeatType;
  /**
   * If true, the raw ASN.1 encoded bytes of the property will be stored in a separate property
   * with 'Raw' suffix.
   */
  raw?: boolean;
}

export type AsnTypeDecorator = (target: IEmptyConstructor) => void;

export const AsnType =
  (options: IAsn1TypeOptions): AsnTypeDecorator =>
  (target: IEmptyConstructor): void => {
    let schema: IAsnSchema;
    if (!schemaStorage.has(target)) {
      schema = schemaStorage.createDefault(target);
      schemaStorage.set(target, schema);
    } else {
      schema = schemaStorage.get(target);
    }
    Object.assign(schema, options);
  };

export const AsnChoiceType = (): AsnTypeDecorator => AsnType({ type: AsnTypeTypes.Choice });

export interface IAsn1SetOptions {
  itemType: AsnItemType;
}

export const AsnSetType = (options: IAsn1SetOptions): AsnTypeDecorator =>
  AsnType({ type: AsnTypeTypes.Set, ...options });

export interface IAsn1SequenceOptions {
  itemType?: AsnItemType;
}

export const AsnSequenceType = (options: IAsn1SequenceOptions): AsnTypeDecorator =>
  AsnType({ type: AsnTypeTypes.Sequence, ...options });

export type AsnPropDecorator = (target: object, propertyKey: string) => void;
export const AsnProp =
  (options: IAsn1PropOptions): AsnPropDecorator =>
  (target: object, propertyKey: string) => {
    let schema: IAsnSchema;
    if (!schemaStorage.has(target.constructor)) {
      schema = schemaStorage.createDefault(target.constructor);
      schemaStorage.set(target.constructor, schema);
    } else {
      schema = schemaStorage.get(target.constructor as IEmptyConstructor);
    }

    const copyOptions = Object.assign({}, options) as IAsnSchemaItem;

    if (typeof copyOptions.type === "number" && !copyOptions.converter) {
      // Set default converters
      const defaultConverter = converters.defaultConverter(options.type as AsnPropTypes);
      if (!defaultConverter) {
        throw new Error(
          `Cannot get default converter for property '${propertyKey}' of ${target.constructor.name}`,
        );
      }
      copyOptions.converter = defaultConverter;
    }

    copyOptions.raw = options.raw;
    schema.items[propertyKey] = copyOptions;
  };

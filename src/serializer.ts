/// <reference path="./@types/asn1js.d.ts" />

import * as asn1 from "asn1js";
import { AsnPropTypes, AsnTypeTypes } from "./enums";
import { isConvertible } from "./helper";
import { schemaStorage } from "./storage";

export class AsnSerializer {
  public static serialize(obj: any): ArrayBuffer {
    return this.toASN(obj).toBER(false);
  }

  public static toASN(obj: any) {
    if (obj && isConvertible(obj.constructor)) {
      return obj.toASN();
    }

    const target = obj.constructor;
    const schema = schemaStorage.get(target);
    schemaStorage.cache(target);

    let asn1Value: any[] = [];
    for (const key in schema.items) {
      const item = schema.items[key];
      const objProp = obj[key];

      // Default value
      if (objProp === undefined || item.defaultValue === objProp) {
        continue; // skip item
      }

      let asn1Item: any;
      if (typeof (item.type) === "number") {
        // type is Asn1PropType Enum
        // we MUST to use Converters
        const converter = item.converter;
        if (!converter) {
          // tslint:disable-next-line:max-line-length
          throw new Error(`Property '${key}' doesn't have converter for type ${AsnPropTypes[item.type]} in schema '${target.name}'`);
        }
        if (item.repeated) {
          asn1Item = Array.from(objProp, (element) => converter.toASN(element));
        } else {
          asn1Item = converter.toASN(objProp);
        }
      } else {
        // type is class with schema
        // use ASN1 schema
        if (item.repeated) {
          asn1Item = Array.from(objProp, (element) => this.toASN(element));
        } else {
          asn1Item = this.toASN(objProp);
        }
      }
      if (item.context !== null && item.context !== undefined) {
        // CONTEXT-SPECIFIC
        if (item.implicit) {
          // IMPLICIT
          if (typeof item.type === "number") {
            const value: { valueHex?: ArrayBuffer, value?: ArrayBuffer } = {};
            value.valueHex = asn1Item.valueBlock.toBER();
            asn1Value.push(new asn1.Primitive({
              optional: item.optional,
              idBlock: {
                tagClass: 3,
                tagNumber: item.context,
              },
              ...value,
            }));
          } else {
            asn1Value.push(new asn1.Constructed({
              optional: item.optional,
              idBlock: {
                tagClass: 3,
                tagNumber: item.context,
              },
              value: asn1Item.valueBlock.value,
            }));
          }
        } else {
          // EXPLICIT
          asn1Value.push(new asn1.Constructed({
            optional: item.optional,
            idBlock: {
              tagClass: 3,
              tagNumber: item.context,
            },
            value: [asn1Item],
          }));
        }
      } else if (item.repeated) {
        asn1Value = asn1Value.concat(asn1Item);
      } else {
        // UNIVERSAL
        asn1Value.push(asn1Item);
      }
    }

    let asnSchema: any;
    switch (schema.type) {
      case AsnTypeTypes.Sequence:
        asnSchema = new asn1.Sequence({ value: asn1Value });
        break;
      case AsnTypeTypes.Set:
        asnSchema = new asn1.Set({ value: asn1Value });
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
}

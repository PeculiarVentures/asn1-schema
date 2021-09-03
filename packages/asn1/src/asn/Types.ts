import { AsnObject } from "./Object";

export const AsnUniversalMap = new Map<number, typeof AsnObject>();

/**
 * Registers the class as universal in type storage
 * @params Tag value
 * @returns
 */
export function universal(tagValue: number) {
  return (target: typeof AsnObject) => {
    AsnUniversalMap.set(tagValue, target);
  };
}

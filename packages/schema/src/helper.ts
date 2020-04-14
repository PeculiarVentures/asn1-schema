import { IAsnConvertible } from "./types";

export function isConvertible(target: any): target is IAsnConvertible<any> {
  if (target && target.prototype) {
    if (target.prototype.toASN && target.prototype.fromASN) {
      return true;
    } else {
      return isConvertible(target.prototype);
    }
  } else {
    return !!(target && target.toASN && target.fromASN);
  }
}

export function isTypeOfArray(target: any): target is typeof Array {
  if (target) {
    const proto = Object.getPrototypeOf(target);
    if (proto?.prototype?.constructor === Array) {
      return true;
    }
    return isTypeOfArray(proto);
  }
  return false;
}
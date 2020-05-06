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

export function isArrayEqual(bytes1: ArrayBuffer, bytes2: ArrayBuffer) {
  if (!(bytes1 && bytes2)) { return false; }
  if (bytes1.byteLength !== bytes2.byteLength) { return false; }

  const b1 = new Uint8Array(bytes1);
  const b2 = new Uint8Array(bytes2);
  for (let i = 0; i < bytes1.byteLength; i++) {
      if (b1[i] !== b2[i]) { return false; }
  }
  return true;
}
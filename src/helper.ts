/// <reference path="./types.d.ts" />

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


import { BERObject, BERConverter, BERIdentifierOctets, BERTagClassFlags } from "../ber";
import { AsnUniversalMap } from "./Types";

export class AsnConverter extends BERConverter {

  protected static override onBeforeObjectInit(id: BERIdentifierOctets): typeof BERObject {
    switch (id.tagClass) {
      case BERTagClassFlags.universal: {
        const asnType = AsnUniversalMap.get(id.tagNumber);
        if (asnType) {
          return asnType as any; // fix type error
        }
      }
      case BERTagClassFlags.contextSpecific:
      default:
        return super.onBeforeObjectInit(id);
    }
  }

  protected static override onAfterObjectInit(object: BERObject): void {
  }

}

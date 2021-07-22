import { ASNBitString } from "./BitString";
import { ASNBmpString } from "./BmpString";
import { ASNBoolean } from "./Boolean";
import { ASNCharacterString } from "./CharacterString";
import { ASNDate } from "./Date";
import { ASNDateTime } from "./DateTime";
import { ASNDuration } from "./Duration";
import { ASNEnumerated } from "./Enumerated";
import { ASNGeneralizedTime } from "./GeneralizedTime";
import { ASNGeneralString } from "./GeneralString";
import { ASNGraphicString } from "./GraphicString";
import { ASNIA5String } from "./IA5String";
import { ASNInteger } from "./Integer";
import { ASNNull } from "./Null";
import { ASNNumericString } from "./NumericString";
import { ASNObjectIdentifier } from "./ObjectIdentifier";
import { ASNOctetString } from "./OctetString";
import { ASNPrintableString } from "./PrintableString";
import { ASNRelativeObjectIdentifier } from "./RelativeObjectIdentifier";
import { ASNSequence } from "./Sequence";
import { ASNSet } from "./Set";
import { ASNTeletexString } from "./TeletexString";
import { ASNTime } from "./Time";
import { ASNTimeOfDay } from "./TimeOfDay";
import { ASNUniversalString } from "./UniversalString";
import { ASNUTCTime } from "./UTCTime";
import { ASNUtf8String } from "./Utf8String";
import { ASNVideotexString } from "./VideotexString";
import { ASNVisibleString } from "./VisibleString";
import { BERObject, BERConverter, BERIdentifierOctets, BERTagClassFlags } from "../ber";

export class ASNConverter extends BERConverter {

  protected static override onBeforeObjectInit(id: BERIdentifierOctets): typeof BERObject {
    switch (id.tagClass) {
      case BERTagClassFlags.universal: {
        switch (id.tagNumber) {
          case 1:
            return ASNBoolean;
          case 2:
            return ASNInteger;
          case 3:
            return ASNBitString;
          case 4:
            return ASNOctetString;
          case 5:
            return ASNNull;
          case 6:
            return ASNObjectIdentifier;
          case 10:
            return ASNEnumerated;
          case 12:
            return ASNUtf8String;
          case 13:
            return ASNRelativeObjectIdentifier;
          case 14:
            return ASNTime;
          case 16:
            return ASNSequence;
          case 17:
            return ASNSet;
          case 18:
            return ASNNumericString;
          case 19:
            return ASNPrintableString;
          case 20:
            return ASNTeletexString;
          case 21:
            return ASNVideotexString;
          case 22:
            return ASNIA5String;
          case 23:
            return ASNUTCTime;
          case 24:
            return ASNGeneralizedTime;
          case 25:
            return ASNGraphicString;
          case 26:
            return ASNVisibleString;
          case 27:
            return ASNGeneralString;
          case 28:
            return ASNUniversalString;
          case 29:
            return ASNCharacterString;
          case 30:
            return ASNBmpString;
          case 31:
            return ASNDate;
          case 32:
            return ASNTimeOfDay;
          case 33:
            return ASNDateTime;
          case 34:
            return ASNDuration;
        }
      }
      case BERTagClassFlags.contextSpecific:
      default:
        return BERObject;
      // throw new Error("Unsupported tag class");
    }
  }

  protected static override onAfterObjectInit(object: BERObject): void {
  }

}

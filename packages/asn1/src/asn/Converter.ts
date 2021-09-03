import { AsnBitString } from "./BitString";
import { AsnBmpString } from "./BmpString";
import { AsnBoolean } from "./Boolean";
import { AsnCharacterString } from "./CharacterString";
import { AsnDate } from "./Date";
import { AsnDateTime } from "./DateTime";
import { AsnDuration } from "./Duration";
import { AsnEnumerated } from "./Enumerated";
import { AsnGeneralizedTime } from "./GeneralizedTime";
import { AsnGeneralString } from "./GeneralString";
import { AsnGraphicString } from "./GraphicString";
import { AsnIA5String } from "./IA5String";
import { AsnInteger } from "./Integer";
import { AsnNull } from "./Null";
import { AsnNumericString } from "./NumericString";
import { AsnObjectIdentifier } from "./ObjectIdentifier";
import { AsnOctetString } from "./OctetString";
import { AsnPrintableString } from "./PrintableString";
import { AsnRelativeObjectIdentifier } from "./RelativeObjectIdentifier";
import { AsnSequence } from "./Sequence";
import { AsnSet } from "./Set";
import { AsnTeletexString } from "./TeletexString";
import { AsnTime } from "./Time";
import { AsnTimeOfDay } from "./TimeOfDay";
import { AsnUniversalString } from "./UniversalString";
import { AsnUTCTime } from "./UTCTime";
import { AsnUtf8String } from "./Utf8String";
import { AsnVideotexString } from "./VideotexString";
import { AsnVisibleString } from "./VisibleString";
import { BERObject, BERConverter, BERIdentifierOctets, BERTagClassFlags } from "../ber";

export class AsnConverter extends BERConverter {

  protected static override onBeforeObjectInit(id: BERIdentifierOctets): typeof BERObject {
    switch (id.tagClass) {
      case BERTagClassFlags.universal: {
        switch (id.tagNumber) {
          case 1:
            return AsnBoolean;
          case 2:
            return AsnInteger;
          case 3:
            return AsnBitString;
          case 4:
            return AsnOctetString;
          case 5:
            return AsnNull;
          case 6:
            return AsnObjectIdentifier;
          case 10:
            return AsnEnumerated;
          case 12:
            return AsnUtf8String;
          case 13:
            return AsnRelativeObjectIdentifier;
          case 14:
            return AsnTime;
          case 16:
            return AsnSequence;
          case 17:
            return AsnSet;
          case 18:
            return AsnNumericString;
          case 19:
            return AsnPrintableString;
          case 20:
            return AsnTeletexString;
          case 21:
            return AsnVideotexString;
          case 22:
            return AsnIA5String;
          case 23:
            return AsnUTCTime;
          case 24:
            return AsnGeneralizedTime;
          case 25:
            return AsnGraphicString;
          case 26:
            return AsnVisibleString;
          case 27:
            return AsnGeneralString;
          case 28:
            return AsnUniversalString;
          case 29:
            return AsnCharacterString;
          case 30:
            return AsnBmpString;
          case 31:
            return AsnDate;
          case 32:
            return AsnTimeOfDay;
          case 33:
            return AsnDateTime;
          case 34:
            return AsnDuration;
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

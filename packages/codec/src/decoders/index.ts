// Re-export all decoders in unified interface
export { PrimitiveDecoders } from "./primitives";
export { StringDecoders } from "./strings";
export { TimeDecoders } from "./time";

import { PrimitiveDecoders } from "./primitives";
import { StringDecoders } from "./strings";
import { TimeDecoders } from "./time";

/**
 * Unified decoders class - maintains backward compatibility
 */
export class AsnDecoders {
  // Primitive types
  static decodeInteger = PrimitiveDecoders.decodeInteger;
  static decodeBoolean = PrimitiveDecoders.decodeBoolean;
  static decodeOctetString = PrimitiveDecoders.decodeOctetString;
  static decodeBitString = PrimitiveDecoders.decodeBitString;
  static decodeNull = PrimitiveDecoders.decodeNull;
  static decodeObjectIdentifier = PrimitiveDecoders.decodeObjectIdentifier;
  static decodeOid = PrimitiveDecoders.decodeOid; // alias
  static decodeEnumerated = PrimitiveDecoders.decodeEnumerated;
  static decodeReal = PrimitiveDecoders.decodeReal;
  static decodeRelativeOid = PrimitiveDecoders.decodeRelativeOid;

  // String types - unified naming (using camelCase)
  static decodeUtf8String = StringDecoders.decodeUtf8String;
  static decodePrintableString = StringDecoders.decodePrintableString;
  static decodeIa5String = StringDecoders.decodeIa5String;
  static decodeBmpString = StringDecoders.decodeBmpString;
  static decodeNumericString = StringDecoders.decodeNumericString;
  static decodeTeletexString = StringDecoders.decodeTeletexString;
  static decodeVideotexString = StringDecoders.decodeVideotexString;
  static decodeGraphicString = StringDecoders.decodeGraphicString;
  static decodeVisibleString = StringDecoders.decodeVisibleString;
  static decodeGeneralString = StringDecoders.decodeGeneralString;
  static decodeUniversalString = StringDecoders.decodeUniversalString;
  static decodeCharacterString = StringDecoders.decodeCharacterString;

  // Time types
  static decodeUtcTime = TimeDecoders.decodeUtcTime;
  static decodeGeneralizedTime = TimeDecoders.decodeGeneralizedTime;

  // Legacy aliases for backward compatibility
  static decodeUTF8String = StringDecoders.decodeUtf8String;
  static decodeIA5String = StringDecoders.decodeIa5String;
  static decodeBMPString = StringDecoders.decodeBmpString;
  static decodeOID = PrimitiveDecoders.decodeOid;
  static decodeENUMERATED = PrimitiveDecoders.decodeEnumerated;
  static decodeREAL = PrimitiveDecoders.decodeReal;
}

import { ContentInfo } from "@peculiar/asn1-cms";
import { AsnType, AsnTypeTypes } from "@peculiar/asn1-schema";

/**
 * ```
 * TimeStampToken ::= ContentInfo
 *      -- contentType is id-signedData ([CMS])
 *      -- content is SignedData ([CMS])
 * ```
 */
@AsnType({ type: AsnTypeTypes.Sequence })
export class TimeStampToken extends ContentInfo {}

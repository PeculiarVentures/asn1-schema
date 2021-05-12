import { ContentInfo } from "@peculiar/asn1-cms";
import { AsnType } from "packages/schema/src/decorators";
import { AsnTypeTypes } from "packages/schema/src/enums";

/**
 * ```
 * TimeStampToken ::= ContentInfo
 *      -- contentType is id-signedData ([CMS])
 *      -- content is SignedData ([CMS])
 * ```
 */
@AsnType({ type: AsnTypeTypes.Sequence })
export class TimeStampToken extends ContentInfo { }

import { AsnArray, AsnType, AsnTypeTypes } from "@peculiar/asn1-schema";
import { ContentInfo } from "@peculiar/asn1-cms";

/**
 * ```
 * AuthenticatedSafe ::= SEQUENCE OF ContentInfo
 *   -- Data if unencrypted
 *   -- EncryptedData if password-encrypted
 *   -- EnvelopedData if public key-encrypted
 * ```
 */
@AsnType({ type: AsnTypeTypes.Sequence, itemType: ContentInfo })
export class AuthenticatedSafe extends AsnArray<ContentInfo> { }

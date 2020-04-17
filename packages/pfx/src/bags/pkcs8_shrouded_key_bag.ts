import { EncryptedPrivateKeyInfo } from "@peculiar/asn1-pkcs8";

/**
 * ```
 * PKCS8ShroudedKeyBag ::= EncryptedPrivateKeyInfo
 * ```
 */
export class PKCS8ShroudedKeyBag extends EncryptedPrivateKeyInfo { }

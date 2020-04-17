import { PrivateKeyInfo } from "@peculiar/asn1-pkcs8";
/**
 * ```
 * KeyBag ::= PrivateKeyInfo
 * ```
 */
export class KeyBag extends PrivateKeyInfo { }
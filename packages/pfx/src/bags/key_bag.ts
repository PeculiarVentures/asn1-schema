import { PrivateKeyInfo } from "@peculiar/asn1-pkcs8";
import { AsnType, AsnTypeTypes } from "@peculiar/asn1-schema";
/**
 * ```asn1
 * KeyBag ::= PrivateKeyInfo
 * ```
 */
@AsnType({ type: AsnTypeTypes.Sequence })
export class KeyBag extends PrivateKeyInfo {}

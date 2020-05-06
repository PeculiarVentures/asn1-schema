import { AsnType, AsnTypeTypes, AsnArray } from "@peculiar/asn1-schema";
import { Targets } from "./target";

/**
 * ```
 * ProxyInfo ::= SEQUENCE OF Targets
 * ```
 */
@AsnType({ type: AsnTypeTypes.Sequence, itemType: Targets })
export class ProxyInfo extends AsnArray<Targets> { }

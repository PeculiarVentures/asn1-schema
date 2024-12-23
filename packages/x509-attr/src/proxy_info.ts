import { AsnType, AsnTypeTypes, AsnArray } from "@peculiar/asn1-schema";
import { Targets } from "./target";

/**
 * ```asn1
 * ProxyInfo ::= SEQUENCE OF Targets
 * ```
 */
@AsnType({ type: AsnTypeTypes.Sequence, itemType: Targets })
export class ProxyInfo extends AsnArray<Targets> {
  constructor(items?: Targets[]) {
    super(items);

    // Set the prototype explicitly.
    Object.setPrototypeOf(this, ProxyInfo.prototype);
  }
}

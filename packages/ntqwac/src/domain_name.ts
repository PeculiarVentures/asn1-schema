import { AsnType, AsnTypeTypes } from "@peculiar/asn1-schema";
import { Name, RelativeDistinguishedName } from "@peculiar/asn1-x509";

@AsnType({ type: AsnTypeTypes.Sequence })
export class DomainName extends Name {
  constructor(items?: RelativeDistinguishedName[]) {
    super(items);

    // Set the prototype explicitly.
    Object.setPrototypeOf(this, Name.prototype);
  }
}

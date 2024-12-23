import { AsnType, AsnTypeTypes } from "@peculiar/asn1-schema";
import { Name, RelativeDistinguishedName } from "@peculiar/asn1-x509";
import { DomainName } from "./domain_name";
import { id_ntQWAC } from "./oids";

export const id_DomainNameLegalRepresentative = `${id_ntQWAC}.2`;

@AsnType({ type: AsnTypeTypes.Sequence })
export class DomainNameLegalRepresentative extends DomainName {
  constructor(items?: RelativeDistinguishedName[]) {
    super(items);

    // Set the prototype explicitly.
    Object.setPrototypeOf(this, Name.prototype);
  }
}

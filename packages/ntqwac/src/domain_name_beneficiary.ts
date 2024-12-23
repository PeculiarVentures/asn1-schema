import { AsnType, AsnTypeTypes } from "@peculiar/asn1-schema";
import { RelativeDistinguishedName, Name } from "@peculiar/asn1-x509";
import { DomainName } from "./domain_name";
import { id_ntQWAC } from "./oids";

export const id_DomainNameBeneficiary = `${id_ntQWAC}.1`;

@AsnType({ type: AsnTypeTypes.Sequence })
export class DomainNameBeneficiary extends DomainName {
  constructor(items?: RelativeDistinguishedName[]) {
    super(items);

    // Set the prototype explicitly.
    Object.setPrototypeOf(this, Name.prototype);
  }
}

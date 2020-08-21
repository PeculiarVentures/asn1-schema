import { AsnType, AsnTypeTypes } from '@peculiar/asn1-schema';
import { Name, RelativeDistinguishedName } from '@peculiar/asn1-x509';
import { DomainName } from './domain_name';
import { id_ntQWAC } from './oids';

export const id_DomainNameOwner = `${id_ntQWAC}.3`;

@AsnType({ type: AsnTypeTypes.Sequence })
export class DomainNameOwner extends DomainName { 

  constructor(items?: RelativeDistinguishedName[]) {
    super(items);

    // Set the prototype explicitly.
    Object.setPrototypeOf(this, Name.prototype);
  }

}

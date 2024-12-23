import { Extensions, Extension } from "@peculiar/asn1-x509";
import { AsnType, AsnTypeTypes } from "@peculiar/asn1-schema";

export const id_certExtensions = "1.3.6.1.4.1.311.2.1.14";

@AsnType({ type: AsnTypeTypes.Sequence })
export class CertExtensions extends Extensions {
  constructor(items?: Extension[]) {
    super(items);

    // Set the prototype explicitly.
    Object.setPrototypeOf(this, CertExtensions.prototype);
  }
}

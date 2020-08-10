import { CertificatePolicies, PolicyInformation } from "@peculiar/asn1-x509";
import { AsnType, AsnTypeTypes } from "@peculiar/asn1-schema";

export const id_certificateApplicationPolicies = "1.3.6.1.4.1.311.21.10";

@AsnType({ type: AsnTypeTypes.Sequence })
export class CertificateApplicationPolicies extends CertificatePolicies {

  constructor(items?: PolicyInformation[]) {
    super(items);

    // Set the prototype explicitly.
    Object.setPrototypeOf(this, CertificateApplicationPolicies.prototype);
  }

}

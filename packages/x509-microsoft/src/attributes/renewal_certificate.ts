import { Certificate } from "@peculiar/asn1-x509";
import { AsnType, AsnTypeTypes } from "@peculiar/asn1-schema";

export const id_renewalCertificate = "1.3.6.1.4.1.311.13.1";

@AsnType({ type: AsnTypeTypes.Sequence })
export class RenewalCertificate extends Certificate { }

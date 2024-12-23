import { OtherName } from "@peculiar/asn1-x509";
import { AsnType, AsnTypeTypes } from "@peculiar/asn1-schema";

export const id_ntPrincipalName = "1.3.6.1.4.1.311.20.2.3";

@AsnType({ type: AsnTypeTypes.Sequence })
export class NTPrincipalName extends OtherName {}

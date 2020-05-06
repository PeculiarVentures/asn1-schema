import { OtherName } from "@peculiar/asn1-x509";
import { AsnType, AsnTypeTypes } from "@peculiar/asn1-schema";

export const id_ntdsReplication = "1.3.6.1.4.1.311.25.1";

@AsnType({ type: AsnTypeTypes.Sequence })
export class NTDSReplication extends OtherName { }

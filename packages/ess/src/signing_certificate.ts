import { AsnProp, AsnPropTypes, OctetString } from '@peculiar/asn1-schema';
import { CertificateSerialNumber, GeneralNames, PolicyInformation } from '@peculiar/asn1-x509';
import { Hash } from './types';

/**
 * ```
 * IssuerSerial ::= SEQUENCE {
 *      issuer                   GeneralNames,
 *      serialNumber             CertificateSerialNumber
 * }
 * ```
 */
export class IssuerSerial {
    @AsnProp({ type: GeneralNames })
    public issuer: GeneralNames = new GeneralNames();

    @AsnProp({ type: AsnPropTypes.Integer })
    public serialNumber: CertificateSerialNumber = new ArrayBuffer(0);
}

/**
 * ```
 * ESSCertID ::=  SEQUENCE {
 *      certHash                 Hash,
 *      issuerSerial             IssuerSerial OPTIONAL
 * }
 * ```
 */
export class EssCertID {
    @AsnProp({ type: AsnPropTypes.OctetString })
    public certHash: Hash = new OctetString();

    @AsnProp({ type: IssuerSerial, optional: true })
    public issuerSerial?: IssuerSerial;

    constructor(params: Partial<ESSCertIDv2> = {}) {
        Object.assign(this, params);
    }
}

/**
 * ```
 * SigningCertificate ::=  SEQUENCE {
 *     certs        SEQUENCE OF ESSCertID,
 *     policies     SEQUENCE OF PolicyInformation OPTIONAL
 * }
 * ```
 */
export class SigningCertificate {
    @AsnProp({ type: EssCertID, repeated: 'sequence' })
    public certs = [];

    @AsnProp({ type: PolicyInformation, repeated: 'sequence', optional: true })
    public policies = [];
}

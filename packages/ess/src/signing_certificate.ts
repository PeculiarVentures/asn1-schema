import { AsnProp, AsnPropTypes, OctetString } from '@peculiar/asn1-schema';
import { CertificateSerialNumber, GeneralNames, PolicyInformation, AlgorithmIdentifier } from '@peculiar/asn1-x509';
import { Hash } from './types';
import { id_sha256 } from '@peculiar/asn1-rsa'

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

    constructor(params: Partial<IssuerSerial> = {}) {
        Object.assign(this, params);
    }
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

    constructor(params: Partial<SigningCertificate> = {}) {
        Object.assign(this, params);
    }
}

/**
 * ```
 * ESSCertIDv2 ::=  SEQUENCE {
 *     hashAlgorithm           AlgorithmIdentifier
 *            DEFAULT {algorithm id-sha256},
 *     certHash                 Hash,
 *     issuerSerial             IssuerSerial OPTIONAL
 * }
 * ```
 */
export class ESSCertIDv2 extends EssCertID {
    @AsnProp({ type: AlgorithmIdentifier, defaultValue: id_sha256 })
    public hashAlgorithm?: AlgorithmIdentifier;

    constructor(params: Partial<ESSCertIDv2> = {}) {
        super(params);
    }
}

/**
 * ```
 * SigningCertificateV2 ::=  SEQUENCE {
 *     certs        SEQUENCE OF ESSCertIDv2,
 *     policies     SEQUENCE OF PolicyInformation OPTIONAL
 * }
 * ```
 */
export class SigningCertificateV2 {
    @AsnProp({ type: ESSCertIDv2, repeated: 'sequence' })
    public certs = [];

    @AsnProp({ type: PolicyInformation, repeated: 'sequence', optional: true })
    public policies = [];

    constructor(params: Partial<SigningCertificateV2> = {}) {
        Object.assign(this, params);
    }
}

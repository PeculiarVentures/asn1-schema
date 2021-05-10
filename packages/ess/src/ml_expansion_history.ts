import { AsnArray, AsnProp, AsnPropTypes, AsnType, AsnTypeTypes } from '@peculiar/asn1-schema';
import { SubjectKeyIdentifier, GeneralNames } from '@peculiar/asn1-x509';
import { IssuerAndSerialNumber } from '@peculiar/asn1-cms';

/**
 * ```
 * EntityIdentifier ::= CHOICE {
 *   issuerAndSerialNumber IssuerAndSerialNumber,
 *   subjectKeyIdentifier SubjectKeyIdentifier }
 * ```
 */
@AsnType({ type: AsnTypeTypes.Choice })
export class EntityIdentifier {
    @AsnProp({ type: IssuerAndSerialNumber })
    public issuerAndSerialNumber?: IssuerAndSerialNumber;

    @AsnProp({ type: SubjectKeyIdentifier })
    public subjectKeyIdentifier?: SubjectKeyIdentifier;

    constructor(params?: IssuerAndSerialNumber | SubjectKeyIdentifier) {
        if (params) {
            if (params instanceof IssuerAndSerialNumber) {
                this.issuerAndSerialNumber = params;
            } else if (params instanceof SubjectKeyIdentifier) {
                this.subjectKeyIdentifier = params;
            } else {
                throw new Error("Unsupported params for EntityIdentifier");
            }
        }
    }
}

/**
 * ```
 * MLReceiptPolicy ::= CHOICE {
 *   none [0] NULL,
 *   insteadOf [1] SEQUENCE SIZE (1..MAX) OF GeneralNames,
 *   inAdditionTo [2] SEQUENCE SIZE (1..MAX) OF GeneralNames }
 * ```
 * @todo - how to implement size?
 */
@AsnType({ type: AsnTypeTypes.Choice })
export class MLReceiptPolicy {
    @AsnProp({ type: AsnPropTypes.Null, context: 0 })
    public none?: AsnPropTypes.Null;

    @AsnProp({ type: GeneralNames, repeated: "sequence", context: 1 })
    public insteadOf?: GeneralNames[];

    @AsnProp({ type: GeneralNames, repeated: "sequence", context: 2 })
    public inAdditionTo?: GeneralNames[];

    constructor(params: Partial<MLReceiptPolicy> = {}) {
        Object.assign(this, params);
    }
}

/**
 * ```
 * MLData ::= SEQUENCE {
 *   mailListIdentifier EntityIdentifier,
 *   expansionTime GeneralizedTime,
 *   mlReceiptPolicy MLReceiptPolicy OPTIONAL }
 * ```
 */
export class MLData {
    @AsnProp({ type: EntityIdentifier })
    public mailListIdentifier: EntityIdentifier = new EntityIdentifier();

    @AsnProp({ type: AsnPropTypes.GeneralizedTime })
    public expansionTime = new Date();

    @AsnProp({ type: MLReceiptPolicy, optional: true })
    public mlReceiptPolicy?: MLReceiptPolicy;

    constructor(params: Partial<MLData> = {}) {
        Object.assign(this, params);
    }
}

/**
 * ```
 * MLExpansionHistory ::= SEQUENCE
 *         SIZE (1..ub-ml-expansion-history) OF MLData
 * ```
 * @todo - implement size constraint?
 */
@AsnType({ type: AsnTypeTypes.Sequence, itemType: MLData })
export class MLExpansionHistory extends AsnArray<MLData> {
    constructor(items?: MLData[]) {
        super(items);

        // Set the prototype explicitly.
        Object.setPrototypeOf(this, MLExpansionHistory.prototype);
    }
}

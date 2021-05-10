import { AsnProp, OctetString } from '@peculiar/asn1-schema';
import { GeneralNames } from '@peculiar/asn1-x509';
import { ContentIdentifier } from './types';
import { ReceiptsFrom } from './receipts_from';

export const ub_receiptsTo = 16;

/**
 * ```
 * ReceiptRequest ::= SEQUENCE {
 *   signedContentIdentifier ContentIdentifier,
 *   receiptsFrom ReceiptsFrom,
 *   receiptsTo SEQUENCE SIZE (1..ub-receiptsTo) OF GeneralNames }
 * ```
 * @todo - is there a way to set the "max" on this?
 */
export class ReceiptRequest {
    @AsnProp({ type: OctetString })
    public signedContentIdentifier: ContentIdentifier = new OctetString();

    @AsnProp({ type: ReceiptsFrom })
    public receiptsFrom: ReceiptsFrom = new ReceiptsFrom();

    @AsnProp({ type: GeneralNames, repeated: "sequence" })
    public receiptsTo: GeneralNames[] = [];

    constructor(params: Partial<ReceiptRequest> = {}) {
        Object.assign(this, params);
    }
}

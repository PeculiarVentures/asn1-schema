import { AsnProp, AsnPropTypes, OctetString } from '@peculiar/asn1-schema';
import { ContentType } from '@peculiar/asn1-cms';
import { ContentIdentifier, ESSVersion } from './types';

/**
 * ```
 * Receipt ::= SEQUENCE {
 *   version ESSVersion,
 *   contentType ContentType,
 *   signedContentIdentifier ContentIdentifier,
 *   originatorSignatureValue OCTET STRING }
 * ```
 */
export class Receipt {
    @AsnProp({ type: AsnPropTypes.Integer })
    public version: ESSVersion = ESSVersion.v1;

    @AsnProp({ type: AsnPropTypes.ObjectIdentifier })
    public contentType: ContentType = '';

    @AsnProp({ type: AsnPropTypes.OctetString })
    public signedContentIdentifier: ContentIdentifier = new OctetString();

    @AsnProp({ type: AsnPropTypes.OctetString })
    public originatorSignatureValue: OctetString = new OctetString();

    constructor(params: Partial<Receipt> = {}) {
        Object.assign(this, params);
    }
}
